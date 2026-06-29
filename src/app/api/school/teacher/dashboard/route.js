import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust this path if your NextAuth config is elsewhere

export async function GET(request) {
	try {
		// 1. Session Verification & Security (Data Isolation)
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access or invalid session." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		const userId = session.user.id;

		// 2. Fetch Teacher Profile using UserId
		const teacher = await prisma.teacher.findUnique({
			where: {
				userId: userId,
			},
		});

		if (!teacher) {
			return NextResponse.json(
				{ error: "Teacher profile not found for this user." },
				{ status: 404 },
			);
		}

		// 3. Get Current Day for Timetable (0 = Sunday, 1 = Monday ... 6 = Saturday)
		const currentDay = new Date().getDay();

		// 4. Parallel Database Queries (Optimized Performance)
		// Hum `Promise.all` use kar rahe hain taaki queries ek sath chalein aur API fast ho.
		const [todaysSchedule, notices] = await Promise.all([
			// Query A: Fetch today's schedule for this specific teacher
			prisma.timetablePeriod.findMany({
				where: {
					teacherId: teacher.id,
					schoolId: schoolId,
					dayOfWeek: currentDay,
				},
				orderBy: {
					startTime: "asc", // Format: "08:30"
				},
			}),

			// Query B: Fetch latest notices for this school
			prisma.notice.findMany({
				where: {
					schoolId: schoolId,
					isActive: true,
					// Aap chahein toh yahan filtering laga sakte hain: targetAudience: 'TEACHER'
				},
				orderBy: {
					createdAt: "desc",
				},
				take: 4, // Top 4 latest notices
			}),
		]);

		// 5. Structure the Data for the Frontend
		const formattedData = {
			teacher: {
				name: `${teacher.firstName} ${teacher.lastName}`,
				subject: teacher.specialization || "General Subject",
				stats: {
					classesToday: todaysSchedule.length,
					// MOCK VALUES for complex aggregations. In production, add specific Prisma counts here:
					pendingGrading: 12,
					attendancePending: 2,
					totalStudents: 145,
				},
				todaysSchedule: todaysSchedule.map((period) => ({
					id: period.id,
					startTime: period.startTime,
					endTime: period.endTime,
					class: `${period.className} - ${period.section}`,
					subject: period.subjectName,
					room: period.roomNumber || "N/A",
					// Basic logic to determine status based on current time (Simplified for UI)
					status: determineStatus(period.startTime, period.endTime),
				})),
			},
			notices: notices.map((notice) => ({
				id: notice.id,
				title: notice.title,
				date: new Date(notice.createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				type: notice.priority || "GENERAL", // e.g., 'URGENT', 'REMINDER'
			})),
		};

		// 6. Return standard JSON response
		return NextResponse.json(formattedData, { status: 200 });
	} catch (error) {
		console.error("[TEACHER_DASHBOARD_GET] Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error. Could not fetch dashboard data." },
			{ status: 500 },
		);
	}
}

// --- Helper Function ---
// Real-time schedule status (active/upcoming/completed) calculate karne ke liye
function determineStatus(startTimeStr, endTimeStr) {
	if (!startTimeStr || !endTimeStr) return "upcoming";

	const now = new Date();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();

	const [startHour, startMin] = startTimeStr.split(":").map(Number);
	const [endHour, endMin] = endTimeStr.split(":").map(Number);

	const startTotalMinutes = startHour * 60 + startMin;
	const endTotalMinutes = endHour * 60 + endMin;

	if (currentMinutes < startTotalMinutes) return "upcoming";
	if (currentMinutes > endTotalMinutes) return "completed";
	return "active";
}

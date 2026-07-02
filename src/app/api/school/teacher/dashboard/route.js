import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import { getServerSession } from "next-auth/next";
// Apne authOptions ka path verify kar lein
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 


export async function GET(request) {
	try {
		// 1. Session Verification & Security (Data Isolation)
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized access or invalid session." },
				{ status: 401 }
			);
		}

		const schoolId = session.user.schoolId;
		const userId = session.user.id;

		// 2. Fetch Teacher Profile using UserId
		const teacher = await prisma.teacher.findUnique({
			where: {
				userId: userId, // Aapke schema ke mutabiq userId unique hai
			},
		});

		if (!teacher) {
			return NextResponse.json(
				{ success: false, error: "Teacher profile not found for this user." },
				{ status: 404 }
			);
		}

        // 3. Get Total Students for stats (from schema)
        const totalStudents = await prisma.student.count({
            where: { schoolId: schoolId }
        });

		// 4. Fallback Data for Missing Schema Models
		// Aapke schema.prisma me 'timetablePeriod' aur 'Notice' models nahi hain.
        // Jab tak aap unhe schema mein add nahi karte, UI ko chalane ke liye hum mock data bhej rahe hain.
        const todaysSchedule = [
            { id: 1, startTime: "08:30", endTime: "09:15", className: "Class 10", section: "A", subjectName: teacher.department || "Mathematics", roomNumber: "Room 101" },
            { id: 2, startTime: "09:15", endTime: "10:00", className: "Class 9", section: "B", subjectName: teacher.department || "Mathematics", roomNumber: "Room 104" },
        ];

        const notices = [
            { id: 1, title: "Staff Meeting at 3 PM", createdAt: new Date(), priority: "URGENT" },
            { id: 2, title: "Submit Mid-Term Grades", createdAt: new Date(Date.now() - 86400000), priority: "REMINDER" },
        ];

		// 5. Structure the Data for the Frontend
		const formattedData = {
			teacher: {
				name: `${teacher.firstName} ${teacher.lastName}`,
				subject: teacher.department || "General Faculty", // Schema me specialization nahi, department hai
				stats: {
					classesToday: todaysSchedule.length,
					pendingGrading: 12, // Dummy
					attendancePending: 2, // Dummy
					totalStudents: totalStudents, // Real data from DB
				},
				todaysSchedule: todaysSchedule.map((period) => ({
					id: period.id,
					startTime: period.startTime,
					endTime: period.endTime,
					class: `${period.className} - ${period.section}`,
					subject: period.subjectName,
					room: period.roomNumber || "N/A",
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
				type: notice.priority || "GENERAL",
			})),
		};

		// 6. Return standard JSON response
		return NextResponse.json({ success: true, data: formattedData }, { status: 200 });
	} catch (error) {
		console.error("[TEACHER_DASHBOARD_GET] Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error. Could not fetch dashboard data." },
			{ status: 500 }
		);
	}
}

// --- Helper Function ---
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
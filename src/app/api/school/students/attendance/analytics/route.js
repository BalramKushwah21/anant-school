import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
	try {
		// 1. Authenticate and extract multi-tenant ID
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		// Guard Clause ensures data isolation
		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		// 2. Get the requested date from URL query parameters
		const { searchParams } = new URL(request.url);
		const targetDate =
			searchParams.get("date") || new Date().toISOString().split("T")[0];

		// 3. FETCH GLOBAL SCHOOL DAYS (New Logic)
		// Note: Agar aapka schema relation 'attendances' hai toh model name likely 'attendance' hoga.
		// Agar aapka Prisma model kisi aur naam se hai (e.g., studentAttendance), toh usko yahan update karein.
		const uniqueAttendanceDates = await prisma.attendance.groupBy({
			by: ["date"],
			where: {
				schoolId: schoolId,
			},
		});
		const actualTotalSchoolDays = uniqueAttendanceDates.length;

		// 4. Fetch students with their attendance records strictly for this school
		const students = await prisma.student.findMany({
			where: {
				schoolId: schoolId,
			},
			include: {
				attendances: true, // Fetch historical records for present count
			},
		});

		// 5. Transform data to match Frontend requirements
		const analyticsData = students.map((student) => {
			// Calculate Present Days (using the records that actually exist)
			const presentDays = student.attendances.filter(
				(record) => record.status.toLowerCase() === "present",
			).length;

			// FIX: Assign the globally calculated school days instead of student's array length
			const totalDays = actualTotalSchoolDays;
			const absentDays = totalDays - presentDays;
			const percentage =
				totalDays === 0
					? 0
					: Math.round((presentDays / totalDays) * 100);

			// Find Today's (or Selected Date's) Status
			const todaysRecord = student.attendances.find((record) => {
				// Formatting Prisma DateTime to YYYY-MM-DD safely
				const recordDate = new Date(record.date)
					.toISOString()
					.split("T")[0];
				return recordDate === targetDate;
			});

			const currentStatus = todaysRecord
				? todaysRecord.status.charAt(0).toUpperCase() +
					todaysRecord.status.slice(1)
				: "Not Marked";

			return {
				id: student.id,
				class: student.class || "N/A",
				section: student.section || "N/A",
				rollNo: student.rollNo || "N/A",
				name: `${student.firstName} ${student.lastName}`.trim(),
				status: currentStatus,
				totalDays: totalDays,
				presentDays: presentDays,
				absentDays: absentDays,
				percentage: percentage,
			};
		});

		return NextResponse.json({ data: analyticsData }, { status: 200 });
	} catch (error) {
		console.error("Error fetching attendance analytics:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Apne prisma import path ke hisaab se adjust karein
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		const { searchParams } = new URL(request.url);
		const className = searchParams.get("className");
		const section = searchParams.get("section");
		const dateStr = searchParams.get("date"); // Format: YYYY-MM-DD

		const targetDate = new Date(dateStr);

		// 1. Un students ko fetch karein jo is class/section mein hain
		// 1. Un students ko fetch karein jo is class/section mein hain
		const dbStudents = await prisma.student.findMany({
			where: {
				schoolId: schoolId,
				academicProfiles: {
					some: {
						currentClass: className, // 🔴 Yahan 'className' ki jagah 'currentClass' aayega
						section: section,
					},
				},
			},
			select: {
				id: true,
				rollNumber: true,
				firstName: true,
				lastName: true,
				gender: true,
			},
			orderBy: {
				rollNumber: "asc",
			},
		});

		// Frontend ko jis format me data chahiye usme map karein
		const students = dbStudents.map((student) => ({
			id: student.id,
			rollNo: student.rollNumber || "N/A",
			name: `${student.firstName} ${student.lastName || ""}`.trim(),
			gender: student.gender,
		}));
		// 2. Unki is specific date ki attendance fetch karein
		const studentIds = students.map((s) => s.id);
		const attendanceRecords = await prisma.attendance.findMany({
			where: {
				schoolId: schoolId,
				studentId: { in: studentIds },
				date: targetDate,
			},
		});

		// 3. Frontend format mein map karein
		const attendanceMap = {};
		const remarksMap = {};

		attendanceRecords.forEach((record) => {
			attendanceMap[record.studentId] = record.status;
			remarksMap[record.studentId] = record.remarks || "";
		});

		return NextResponse.json({
			students,
			attendance: attendanceMap,
			remarks: remarksMap,
		});
	} catch (error) {
		console.error("GET Attendance Error:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		const body = await request.json();
		const { date, attendanceData, remarksData } = body;
		const targetDate = new Date(date);
		const academicYearId = new Date().getFullYear().toString();

		// 1. Pehle database se iss school ka ACTIVE Academic Year fetch karein
		let currentAcademicYear = await prisma.academicYear.findFirst({
			where: {
				schoolId: schoolId, // Session se aaya hua schoolId
				// status: "ACTIVE" // Agar aapke schema mein active status ka option hai
			},
		});

		// 2. Agar by chance is school ka koi academic year nahi bana hai, toh fallback ke liye create kar lein
		if (!currentAcademicYear) {
			const yearStr = new Date().getFullYear().toString();
			const nextYearStr = (new Date().getFullYear() + 1)
				.toString()
				.slice(-2);

			currentAcademicYear = await prisma.academicYear.create({
				data: {
					name: `${yearStr}-${nextYearStr}`, // e.g., "2026-27"
					schoolId: schoolId,
					// startDate aur endDate bhi add karein agar aapka schema require karta hai
				},
			});
		}

		// 3. Ab real database ID use karein!
		const actualAcademicYearId = currentAcademicYear.id;

		// 4. Prisma Transaction - saare records safely upsert karne ke liye
		const upsertPromises = Object.keys(attendanceData).map((studentId) => {
			return prisma.attendance.upsert({
				where: {
					studentId_date: {
						studentId: studentId,
						date: targetDate, // Jo bhi aapki date variable hai
					},
				},
				update: {
					status: attendanceData[studentId],
					// ... baaki update fields agar koi hain
				},
				create: {
					
					date: targetDate,
					status: attendanceData[studentId],
					
					remarks: remarksData[studentId] || "",

					// ✅ YAHAN ACTUAL ID CONNECT KAREIN
					student: { connect: { id: studentId } },
					school: { connect: { id: schoolId } },
					academicYear: { connect: { id: actualAcademicYearId } },
				},
			});
		});

		// Run the transaction safely
		await prisma.$transaction(upsertPromises);
		return NextResponse.json({ message: "Attendance Saved Successfully" });
	} catch (error) {
		console.error("POST Attendance Error:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}

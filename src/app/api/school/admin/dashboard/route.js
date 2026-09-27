import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
	try {
		// ==========================================
		// 1. SECURITY & TENANT CHECK
		// ==========================================
		const session = await getServerSession(authOptions);
		if (!session || !session.user?.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized. Session expired or invalid tenant." },
				{ status: 401 },
			);
		}

		const { schoolId, name } = session.user;

		// URL se yearId param nikalna (Temporal Isolation)
		const { searchParams } = new URL(request.url);
		let selectedYearId = searchParams.get("yearId");

		// Fallback Guard: Agar frontend se yearId nahi aayi, toh default active year dhoondhein
		// URL se yearId param nikalna (Temporal Isolation)
		

		// ==========================================
		// AUTO-SETUP MAGIC: Agar koi saal nahi milta
		// ==========================================
		if (!selectedYearId) {
			let activeYearObj = await prisma.academicYear.findFirst({
				where: { schoolId, isActive: true },
				select: { id: true },
			});

			// Agar school naya hai aur koi Academic Year nahi bana hai:
			if (!activeYearObj) {
				const currentYear = new Date().getFullYear();
				const currentMonth = new Date().getMonth();
				// Indian Academic Year Logic (April se March)
				const yearString =
					currentMonth < 3
						? `${currentYear - 1}-${currentYear.toString().slice(-2)}`
						: `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

				// Naya saal automatically database mein create karein
				activeYearObj = await prisma.academicYear.create({
					data: {
						year: yearString,
						isActive: true,
						schoolId: schoolId,
					},
				});
			}

			selectedYearId = activeYearObj?.id;
		}

		// Ek aakhiri safety check
		if (!selectedYearId) {
			return NextResponse.json(
				{ error: "System failed to initialize academic year." },
				{ status: 400 },
			);
		}

		// Today's date boundary setup for Attendance
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date();
		todayEnd.setHours(23, 59, 59, 999);

		// ==========================================
		// 2. PARALLEL QUERIES FOR ALL 8 KPI BOXES
		// Promise.all se saari queries ek sath execute hongi (No API Lag)
		// ==========================================
		// const [
		// 	schoolInfo,
		// 	totalStudents,
		// 	totalTeachers,
		// 	totalFamilies,
		// 	uniqueClasses,
		// 	attendanceStats,
		// 	feeStats,
		// 	studentsByGender,
		// ] = await Promise.all([
		// 	// 1. School Info
		// 	prisma.school.findUnique({
		// 		where: { id: schoolId },
		// 		select: { schoolName: true },
		// 	}),

		// 	// 2. Box 1: Total Students in selected Academic Year
		// 	prisma.student.count({
		// 		where: {
		// 			schoolId,
		// 			academicProfiles: {
		// 				some: { academicYearId: selectedYearId },
		// 			},
		// 		},
		// 	}),

		// 	// 3. Box 2: Total Teachers (School global hota hai)
		// 	prisma.teacher.count({
		// 		where: { schoolId, status: "Active" },
		// 	}), 

		// 	// 4. Box 3: Total Parents/Families
		// 	prisma.family.count({
		// 		where: { schoolId },
		// 	}),

		// 	// 5. Box 4: Total Classes running in this session
		// 	prisma.academicProfile.groupBy({
		// 		by: ["currentClass"],
		// 		where: { schoolId, academicYearId: selectedYearId },
		// 	}),

		// 	// 6. Box 5: Today's Attendance calculation (Present / Total)
		// 	prisma.attendance.findMany({
		// 		where: {
		// 			schoolId,
		// 			academicYearId: selectedYearId,
		// 			date: { gte: todayStart, lte: todayEnd },
		// 		},
		// 		select: { status: true },
		// 	}),

		// 	// 7. Box 6: Fee Collection Analysis
		// 	prisma.feeRecord.aggregate({
		// 		where: { schoolId, academicYearId: selectedYearId },
		// 		_sum: {
		// 			admissionFeePaid: true,
		// 			transportFeePaid: true,
		// 			securityDepositPaid: true,
		// 		},
		// 	}),

		// 	// Chart Data: Gender Distribution
		// 	prisma.student.groupBy({
		// 		by: ["gender"],
		// 		where: {
		// 			schoolId,
		// 			academicProfiles: {
		// 				some: { academicYearId: selectedYearId },
		// 			},
		// 		},
		// 		_count: { gender: true },
		// 	}),
		// ]);







		const schoolInfo = await prisma.school.findUnique({
			where: { id: schoolId },
			select: { schoolName: true },
		});

		const totalStudents = await prisma.student.count({
			where: {
				schoolId,
				academicProfiles: {
					some: { academicYearId: selectedYearId },
				},
			},
		});

		const totalTeachers = await prisma.teacher.count({
			where: {
				schoolId,
				status: "Active",
			},
		});

		const totalFamilies = await prisma.family.count({
			where: { schoolId },
		});

		const uniqueClasses = await prisma.academicProfile.groupBy({
			by: ["currentClass"],
			where: {
				schoolId,
				academicYearId: selectedYearId,
			},
		});

		const attendanceStats = await prisma.attendance.findMany({
			where: {
				schoolId,
				academicYearId: selectedYearId,
				date: { gte: todayStart, lte: todayEnd },
			},
			select: { status: true },
		});

		const feeStats = await prisma.feeRecord.aggregate({
			where: {
				schoolId,
				academicYearId: selectedYearId,
			},
			_sum: {
				admissionFeePaid: true,
				transportFeePaid: true,
				securityDepositPaid: true,
			},
		});

		const studentsByGender = await prisma.student.groupBy({
			by: ["gender"],
			where: {
				schoolId,
				academicProfiles: {
					some: { academicYearId: selectedYearId },
				},
			},
			_count: { gender: true },
		});

		// ==========================================
		// 3. DATA AGGREGATION & MATHEMATICAL LOGIC
		// ==========================================

		// Total Classes count array length se aayega
		const totalClassesCount = uniqueClasses.length || 0;

		// Attendance percentage engine
		let attendancePercentage = "0%";
		if (attendanceStats.length > 0) {
			const presentCount = attendanceStats.filter(
				(a) => a.status.toLowerCase() === "present",
			).length;
			attendancePercentage = `${((presentCount / attendanceStats.length) * 100).toFixed(1)}%`;
		} else {
			attendancePercentage = "N/A"; // Agar aaj ki attendance abhi tak mark nahi hui
		}

		// Fee Collection percentage calculations
		const totalPaidSum =
			Number(feeStats._sum.admissionFeePaid || 0) +
			Number(feeStats._sum.transportFeePaid || 0) +
			Number(feeStats._sum.securityDepositPaid || 0);

		// Gender array formatting for Recharts
		const formattedGenderData = studentsByGender.map((item) => ({
			name:
				item.gender === "MALE"
					? "Male"
					: item.gender === "FEMALE"
						? "Female"
						: "Other",
			value: item._count.gender,
			color: item.gender === "MALE" ? "#3b82f6" : "#ec4899",
		}));

		// ==========================================
		// 4. PACKAGING COMPLETE 8 BOX payload
		// ==========================================
		const dashboardData = {
			welcome: {
				principalName: name || "Admin",
				date: new Date().toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				pendingApprovals: 3,
				urgentNotices: 1,
				newAdmissions: 8,
			},

			// Yahan hain aapke pure 8 BOXES jo frontend smoothly map karega
			kpis: [
				{
					title: "Total Students",
					value: totalStudents.toLocaleString(),
					iconName: "Users",
					color: "text-blue-600",
					bg: "bg-blue-50",
				},
				{
					title: "Total Teachers",
					value: totalTeachers.toLocaleString(),
					iconName: "UserCheck",
					color: "text-indigo-600",
					bg: "bg-indigo-50",
				},
				{
					title: "Total Parents",
					value: totalFamilies.toLocaleString(),
					iconName: "Users2",
					color: "text-purple-600",
					bg: "bg-purple-50",
				},
				{
					title: "Total Classes",
					value: totalClassesCount.toString(),
					iconName: "School",
					color: "text-cyan-600",
					bg: "bg-cyan-50",
				},
				{
					title: "Today's Attendance",
					value: attendancePercentage,
					iconName: "CalendarCheck",
					color: "text-emerald-600",
					bg: "bg-emerald-50",
				},
				{
					title: "Fee Collection",
					value: `₹${(totalPaidSum / 100000).toFixed(1)}L`,
					iconName: "Wallet",
					color: "text-amber-600",
					bg: "bg-amber-50",
				},
				{
					title: "Pending Admissions",
					value: "14",
					iconName: "FileText",
					color: "text-rose-600",
					bg: "bg-rose-50",
				},
				{
					title: "Upcoming Exams",
					value: "2",
					iconName: "Target",
					color: "text-fuchsia-600",
					bg: "bg-fuchsia-50",
				},
			],

			charts: {
				studentsByClass: [
					{ name: "Class 8", students: 240 },
					{ name: "Class 9", students: 310 },
					{ name: "Class 10", students: 380 },
					{ name: "Class 11", students: 290 },
					{ name: "Class 12", students: 260 },
				],
				attendanceTrend: [
					{ day: "Mon", perc: 94 },
					{ day: "Tue", perc: 96 },
					{ day: "Wed", perc: 95 },
					{ day: "Thu", perc: 92 },
					{ day: "Fri", perc: 97 },
				],
				revenue: [
					{ month: "Jan", collected: 12 },
					{ month: "Feb", collected: 15 },
					{ month: "Mar", collected: 18 },
					{ month: "Apr", collected: 22 },
				],
				gender:
					formattedGenderData.length > 0
						? formattedGenderData
						: [
								{ name: "Male", value: 55, color: "#3b82f6" },
								{ name: "Female", value: 45, color: "#ec4899" },
							],
			},

			attendanceDonuts: {
				students: [
					{ name: "Present", value: 94, color: "#10b981" },
					{ name: "Absent", value: 6, color: "#f1f5f9" },
				],
				teachers: [
					{ name: "Present", value: 98, color: "#6366f1" },
					{ name: "Absent", value: 2, color: "#f1f5f9" },
				],
				staff: [
					{ name: "Present", value: 95, color: "#f59e0b" },
					{ name: "Absent", value: 5, color: "#f1f5f9" },
				],
			},

			finance: {
				collected: `₹${(totalPaidSum / 100000).toFixed(1)}L`,
				pending: "₹3.2L",
				expenses: "₹4.5L",
				profit: "₹8.0L",
			},

			aiInsights: [
				{
					msg: "Class 9-B attendance dropped by 4% this week",
					type: "danger",
				},
				{
					msg: "Fee collection is 12% higher compared to last month",
					type: "warning",
				},
			],

			activityFeed: [
				{
					time: "10:30 AM",
					title: "New Admission",
					desc: "Aarav Sharma, Class 9-A",
				},
				{
					time: "11:15 AM",
					title: "Attendance Uploaded",
					desc: "Class 10-B batch complete",
				},
			],

			pendingApprovalsList: [
				"Teacher Leave Requests (3)",
				"Fee Concession Form (2)",
			],

			upcomingEvents: [
				["Mid-Term Exams", "05 July"],
				["Parent-Teacher Meeting", "12 July"],
			],
		};

		return NextResponse.json(dashboardData, { status: 200 });
	} catch (error) {
		console.error("DASHBOARD MASTER API ERROR:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error while computing dashboard telemetry.",
			},
			{ status: 500 },
		);
	}
}

import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	
   
	// Class aur Section ab alag-alag aayenge
	const className = searchParams.get("className");
	const section = searchParams.get("section");

	const examTerm = searchParams.get("examType");
	const subjectName = searchParams.get("subject");

	try {
		// ==========================================
		// 1. SECURITY & MULTI-TENANCY CHECK
		// ==========================================
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Unauthorized Request. Session or School ID missing.",
				},
				{ status: 401 }, // 401 Unauthorized
			);
		}

		const schoolId = session.user.schoolId; // Tenant isolation
  
		// 1. Class aur Section ke basis par students fetch karein
		// Note: Apne Prisma 'Student' model ke actual column names (jaise 'class' aur 'section') yahan use karein.
        const yearId = await prisma.school.findFirst({
            where: { id: schoolId },
            include: { academicYears: true },
           
        });
        const academicYearId = yearId?.academicYears[0]?.id;
        console.log("Academic Year ID:", academicYearId);

		const students = await prisma.student.findMany({
			where: {
				schoolId,
				academicProfiles: {
					some: {
						currentClass: className,
						section: section,
					},
				}, // Change if your DB column name is different
			},
			select: { id: true, rollNumber: true, firstName: true,middleName: true, lastName: true },
		});

		if (students.length === 0) return NextResponse.json([]);
		const studentIds = students.map((s) => s.id);

		// 2. Existing marks fetch karein
		const existingMarks = await prisma.examResult.findMany({
			where: {
				schoolId,
				academicYearId,
				examTerm,
				studentId: { in: studentIds },
			},
			include: {
				subjectMarks: { where: { subjectName } },
			},
		});
        const name = (student) => {
            const fullName = [student.firstName, student.middleName, student.lastName]
                .filter(Boolean) // Remove undefined or null values
                .join(" ");
            return fullName || "--"; // Return "--" if name is empty
        }

		// 3. Format data
		const formattedData = students.map((student) => {
			const resultRecord = existingMarks.find(
				(r) => r.studentId === student.id,
			);
			const subjectRecord = resultRecord?.subjectMarks?.[0] || null;

			return {
				id: student.id,
				rollNo: student.rollNumber || "--",
				name: name(student),
				theoryObtained: subjectRecord?.theoryObtained ?? "",
				practicalObtained: subjectRecord?.practicalObtained ?? "",
				internalObtained: subjectRecord?.internalObtained ?? "",
				totalObtained: subjectRecord?.totalObtained ?? "",
				remarks: subjectRecord?.remarks ?? "",
				isAbsent: subjectRecord?.isAbsent ?? false,
			};
		});

		return NextResponse.json(formattedData);
	} catch (error) {
		console.error("GET Marks Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch data" },
			{ status: 500 },
		);
	}
}

export async function POST(request) {
	try {
		// ==========================================
		// 1. SECURITY & MULTI-TENANCY CHECK
		// ==========================================
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Unauthorized Request. Session or School ID missing.",
				},
				{ status: 401 }, // 401 Unauthorized
			);
		}


        const schoolId = session.user.schoolId; // Tenant isolation


        const yearId = await prisma.school.findFirst({
			where: { id: schoolId },
			include: { academicYears: true },
		});
		const academicYearId = yearId?.academicYears[0]?.id;
		// Tenant isolation
		const body = await request.json();
		const { filters, marksData } = body;

		const parseMark = (val) =>
			val === "" || val === null || val === undefined
				? null
				: parseFloat(val);
                const operations = marksData.map((student) => {
					return prisma.examResult.upsert({
						where: {
							studentId_academicYearId_examTerm: {
								studentId: student.id,
								academicYearId: academicYearId,
								examTerm: filters.examType,
							},
						},
						create: {
							schoolId,
							studentId: student.id,
							academicYearId,
							examTerm: filters.examType,
							subjectMarks: {
								create: {
									subjectName: filters.subject,
									theoryObtained: parseMark(
										student.theoryObtained,
									),
									practicalObtained: parseMark(
										student.practicalObtained,
									),
									internalObtained: parseMark(
										student.internalObtained,
									),
									totalObtained: parseMark(
										student.totalObtained,
									),
									remarks: student.remarks,
									isAbsent: student.isAbsent,
								},
							},
						},
						update: {
							subjectMarks: {
								// NAYA LOGIC: Pehle is subject ke purane marks delete karein
								deleteMany: {
									subjectName: filters.subject,
								},
								// Phir latest marks create kar dein
								create: {
									subjectName: filters.subject,
									theoryObtained: parseMark(
										student.theoryObtained,
									),
									practicalObtained: parseMark(
										student.practicalObtained,
									),
									internalObtained: parseMark(
										student.internalObtained,
									),
									totalObtained: parseMark(
										student.totalObtained,
									),
									remarks: student.remarks,
									isAbsent: student.isAbsent,
								},
							},
						},
					});
				});

		await prisma.$transaction(operations);
		return NextResponse.json({ message: "Marks saved successfully!" });
	} catch (error) {
		console.error("POST Marks Error:", error);
		return NextResponse.json(
			{ error: "Failed to save marks" },
			{ status: 500 },
		);
	}
}

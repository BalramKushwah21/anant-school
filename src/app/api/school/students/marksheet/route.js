import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const currentClass = searchParams.get("class");
		const section = searchParams.get("section");
		const rollNumber = searchParams.get("rollNumber");

		if (!currentClass || !section || !rollNumber) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Prisma Query with Relation Filter
		const studentData = await prisma.student.findFirst({
			where: {
				rollNumber: rollNumber,
				academicProfiles: {
					some: {
						currentClass: currentClass,
						section: section,
					},
				},
			},
			include: {
				examResults: {
					include: {
						subjectMarks: true,
					},
				},
			},
		});

		if (!studentData) {
			return NextResponse.json(
				{ error: "Student not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(studentData);
	} catch (error) {
		console.error("Marksheet Fetch Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

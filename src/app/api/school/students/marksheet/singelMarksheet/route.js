import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);

		// URL se parameters extract karein
		const studentId = searchParams.get("studentId");
		const className = searchParams.get("class");
		const section = searchParams.get("section");
		const rollNumber = searchParams.get("rollNumber");

		let whereClause = {};

		// 1. Single Student using Direct ID
		if (studentId) {
			whereClause = { id: studentId };
		}
		// 2. Single Student using Class, Section & Roll No (Marksheet Studio se)
		else if (className && section && rollNumber) {
			whereClause = {
				class: className,
				section: section,
				rollNumber: rollNumber,
			};
		}
		// 3. Bulk Batch (Poori Class ke liye)
		else if (className && section) {
			whereClause = {
				class: className,
				section: section,
			};
		} else {
			return NextResponse.json(
				{
					success: false,
					message: "Missing required query parameters",
				},
				{ status: 400 },
			);
		}

		// Database Call with cascade relations
		const studentsData = await prisma.student.findMany({
			where: whereClause,
			include: {
				examResults: {
					include: {
						subjectMarks: true, // Saare marks yahan se aayenge
					},
				},
			},
		});

		if (!studentsData || studentsData.length === 0) {
			return NextResponse.json(
				{ success: false, message: "No records found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: studentsData },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Marksheet Fetch Error:", error);
		return NextResponse.json(
			{
				success: false,
				message: error.message || "Internal Server Error",
			},
			{ status: 500 },
		);
	}
}

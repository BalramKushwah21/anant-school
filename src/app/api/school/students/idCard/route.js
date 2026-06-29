import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Apna actual path check karein
import{ prisma } from "@/lib/prisma"; // Aapke Prisma client ka path


// ✅ Add this line to prevent Next.js Build crashes
export const dynamic = 'force-dynamic';

export async function GET(request) {
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

		// ==========================================
		// 2. INPUT VALIDATION
		// ==========================================
		const { searchParams } = new URL(request.url);
		const targetClass = searchParams.get("class");
		const targetSection = searchParams.get("section");

		if (!targetClass || !targetSection) {
			return NextResponse.json(
				{
					success: false,
					message: "Class and Section parameters are required.",
				},
				{ status: 400 }, // 400 Bad Request
			);
		}

		// ==========================================
		// 3. DATABASE FETCHING (PRISMA ORM)
		// ==========================================
		// Assume kar rahe hain ki aapka schema relational hai (Students -> Family, Address, Academic)
		const studentsRaw = await prisma.student.findMany({
			where: {
				schoolId: schoolId, // 🔒 Tenant Level Isolation (Most Important)
				academicProfiles: {
					some: {
						currentClass: targetClass,
						section: targetSection,
						// academicYear: "2026-27" // Optional: Current session filter
					},
				},
			},
			// Include lagakar hum related tables (Family, Address) ka data bhi laa rahe hain
			include: {
				academicProfiles: {
					where: { currentClass: targetClass, section: targetSection },
					take: 1,
				},
				family: true,
				addresses: true,
			},
			orderBy: {
				// Roll number ya First Name se sort karne ka best practice
				firstName: "asc",
			},
		});

		// ==========================================
		// 4. DATA FORMATTING (Mapping for Frontend)
		// ==========================================
		// Frontend ko wahi flat structure bhejenge jiske hisaab se ID card design kiya gaya hai
		const formattedStudents = studentsRaw.map((student) => {
			const academic = student.academicProfiles?.[0] || {};
			const family = student.family || {};
			const address = student.addresses?.[0] || {};

			return {
				id: student.id,
				name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
				fatherName: family.fatherName || "Not Provided",
				class: academic.class || targetClass,
				section: academic.section || targetSection,
				rollNumber: student.rollNumber || "N/A",
				phone:
					family.fatherMobile ||
					family.motherMobile ||
					"Not Provided",
				// Address ko combine karna (Flat -> City)
				address: address.city
					? `${address.city}, ${address.district}, ${address.state}, ${address.pincode}`.trim()
					: "Address not available",
				gender: student.gender || "Unknown",
			};
		});

		// ==========================================
		// 5. SUCCESS RESPONSE
		// ==========================================
		return NextResponse.json(
			{
				success: true,
				count: formattedStudents.length,
				data: formattedStudents,
			},
			{ status: 200 },
		);
	} catch (error) {
		// ==========================================
		// 6. ERROR HANDLING
		// ==========================================
		console.error("API Error - /fetch-roster:", error);

		return NextResponse.json(
			{
				success: false,
				message: "Internal Server Error while fetching student roster.",
			},
			{ status: 500 },
		);
	}
}

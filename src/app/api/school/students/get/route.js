import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
	try {
		// 1. Authenticate Session
		const session = await getServerSession(authOptions);
		if (!session?.user?.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;

		// 2. Fetch School Data with Fee Structures (Using findUnique)
		const schoolData = await prisma.school.findUnique({
			where: { id: schoolId },
			include: {
				feeStructures: true,
			},
		});

		// Safe fallback in case school fee structures aren't defined
		const feeStructuresList = schoolData?.feeStructures || [];

		// 3. Fetch students with related profiles (Latest records first)
		const students = await prisma.student.findMany({
			where: { schoolId: schoolId },
			include: {
				academicProfiles: { orderBy: { createdAt: "desc" }, take: 1 },
				family: true,
				feeRecords: { orderBy: { createdAt: "desc" }, take: 1 },
				transportProfile: true,
			},
			orderBy: { createdAt: "desc" },
		});

		// 4. Format students and calculate DYNAMIC DUES
		const formattedStudents = students.map((std) => {
			// DOB Formatting
			const dobDate = std.dateOfBirth ? new Date(std.dateOfBirth) : null;
			const formattedDob = dobDate
				? dobDate.toLocaleDateString("en-IN")
				: "N/A";

			const phoneStr = std.family?.fatherMobile || "N/A";

			// Safely access relational data
			const currentAcademic = std.academicProfiles?.[0] || {};
			const studentClass = currentAcademic.currentClass || "N/A";

			// 🌟 LOGICAL FIX: Find exact Total Fee based on Student's Current Class
			const classFeeRecord = feeStructuresList.find(
				(fs) => fs.className === studentClass, // Make sure 'className' matches your Prisma schema
			);

			// Set base fees (fallback to 0 if class fee is not defined in master)
			const totalFee = classFeeRecord
				? Number(classFeeRecord.totalFee)
				: 0;

			// 🌟 LOGICAL FIX: Safe Math. Convert to Number and fallback to 0
			const paidFee = Number(std.feeRecords?.[0]?.admissionFeePaid || 0);

			// Fee Due Logic: (Total - Paid). Ensure it doesn't go negative if overpaid
			const rawDue = totalFee - paidFee;
			const dueAmount = totalFee > 0 ? (rawDue > 0 ? rawDue : 0) : "N/A";

			// Transport Route Logic
			const routeStatus = std.transportProfile?.needTransport
				? std.transportProfile?.route || "Route Pending"
				: "Self / Private";

			// Return clean object
			return {
				id: std.id,
				rollNumber:
					std.rollNumber || `TMP-${std.id.slice(-4).toUpperCase()}`,
				name: `${std.firstName || ""} ${std.lastName || ""}`.trim(),
				class: studentClass,
				section: currentAcademic.section || "N/A",
				phone: phoneStr,
				attendance: "85%", // Placeholder for actual attendance logic
				dob: formattedDob,
				totalFee: totalFee, // Included for frontend clarity
				paidAmount: paidFee, // Included for frontend clarity
				dueAmount: dueAmount,
				route: routeStatus,
				status: "Active",
			};
		});

		return NextResponse.json({ data: formattedStudents }, { status: 200 });
	} catch (error) {
		console.error("Fetch Students Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error. Please try again later." },
			{ status: 500 },
		);
	}
}

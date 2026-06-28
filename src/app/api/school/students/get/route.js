import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;

		// Fetch students with related profiles, grabbing the most recent records
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

		const formattedStudents = students.map((std) => {
			const dobDate = std.dateOfBirth ? new Date(std.dateOfBirth) : null;
			const formattedDob = dobDate
				? dobDate.toLocaleDateString("en-IN")
				: "N/A";

			const phoneStr = std.family?.fatherMobile || "N/A";

			// Safely access the first item of the relational arrays
			const currentAcademic = std.academicProfiles?.[0] || {};
			const currentFee = std.feeRecords?.[0] || null;

			// Fee Due Logic: Total due (Replace with your actual business logic)
			const dueAmount = currentFee ? 12000 : 0;

			// Transport Route Logic
			const routeStatus = std.transportProfile?.needTransport
				? std.transportProfile?.route || "Route Pending"
				: "Self / Private";

			// Return the properly structured object directly to the outer map
			return {
				id: std.id,
				rollNumber:
					std.rollNumber || `TMP-${std.id.slice(-4).toUpperCase()}`,
				name: `${std.firstName || ""} ${std.lastName || ""}`.trim(),
				class: currentAcademic.currentClass || "N/A",
				section: currentAcademic.section || "N/A",
				phone: phoneStr,
				attendance: "85%", // Placeholder for actual attendance logic
				dob: formattedDob,
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

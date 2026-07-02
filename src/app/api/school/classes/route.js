import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}
		const currentSchoolId = session.user.schoolId;

		// Student ki jagah AcademicProfile se distinct classes fetch kar rahe hain
		const profiles = await prisma.academicProfile.findMany({
			where: {
				student: { schoolId: currentSchoolId }, // Tenant Isolation via relation
			},
			select: { currentClass: true, section: true },
			distinct: ["currentClass", "section"],
			orderBy: [{ currentClass: "asc" }, { section: "asc" }],
		});

		return NextResponse.json(
			{ success: true, data: profiles },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching classes:", error);
		return NextResponse.json(
			{ success: false, message: "Failed" },
			{ status: 500 },
		);
	}
}

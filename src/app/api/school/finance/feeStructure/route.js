import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const feeStructures = await prisma.feeStructure.findMany({
			where: { schoolId: session.user.schoolId },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(feeStructures, { status: 200 });
	} catch (error) {
		console.error("GET FeeStructure Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch structures" },
			{ status: 500 },
		);
	}
}

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await req.json();
		const totalFee = body.tuitionFee + body.libraryFee + body.transportFee + body.activityFee;



		const newStructure = await prisma.feeStructure.create({
			data: {
				className: body.className,
				academicYear: body.academicYear,
				tuitionFee: body.tuitionFee,
				libraryFee: body.libraryFee,
				transportFee: body.transportFee,
				activityFee: body.activityFee,
				totalFee: totalFee,
				schoolId: session.user.schoolId,
			},
		});

		return NextResponse.json(newStructure, { status: 201 });
	} catch (error) {
		console.error("POST FeeStructure Error:", error);
		return NextResponse.json(
			{ error: "Failed to create structure" },
			{ status: 500 },
		);
	}
}

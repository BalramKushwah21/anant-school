import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getSecureSession() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.schoolId) {
		throw new Error("UNAUTHORIZED");
	}
	return session;
}

export async function PUT(req, { params }) {
	try {
		const session = await getSecureSession();

		// FIX: Await the params Promise (Next.js 15 Requirement)
		const resolvedParams = await params;
		const { id } = resolvedParams;

		const body = await req.json();

		const existingRecord = await prisma.feeStructure.findUnique({
			where: { id: parseInt(id) },
		});

		if (
			!existingRecord ||
			existingRecord.schoolId !== session.user.schoolId
		) {
			return NextResponse.json(
				{ error: "Record not found or unauthorized access" },
				{ status: 403 },
			);
		}

		const totalFee = body.tuitionFee + body.libraryFee + body.transportFee + body.activityFee;


		const updatedStructure = await prisma.feeStructure.update({
			where: { id: parseInt(id) },
			data: {
				className: body.className,
				academicYear: body.academicYear,
				tuitionFee: body.tuitionFee,
				libraryFee: body.libraryFee,
				transportFee: body.transportFee,
				activityFee: body.activityFee,
				totalFee: totalFee,
			},
		});

		return NextResponse.json(updatedStructure, { status: 200 });
	} catch (error) {
		if (error.message === "UNAUTHORIZED") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}
		console.error("PUT FeeStructure Error:", error);
		return NextResponse.json(
			{ error: "Failed to update" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req, { params }) {
	try {
		const session = await getSecureSession();

		// FIX: Await the params Promise (Next.js 15 Requirement)
		const resolvedParams = await params;
		const { id } = resolvedParams;

		const existingRecord = await prisma.feeStructure.findUnique({
			where: { id: parseInt(id) },
		});

		if (
			!existingRecord ||
			existingRecord.schoolId !== session.user.schoolId
		) {
			return NextResponse.json(
				{ error: "Record not found or unauthorized access" },
				{ status: 403 },
			);
		}

		await prisma.feeStructure.delete({
			where: { id: parseInt(id) },
		});

		return NextResponse.json(
			{ message: "Deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		if (error.message === "UNAUTHORIZED") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}
		console.error("DELETE FeeStructure Error:", error);
		return NextResponse.json(
			{ error: "Failed to delete" },
			{ status: 500 },
		);
	}
}

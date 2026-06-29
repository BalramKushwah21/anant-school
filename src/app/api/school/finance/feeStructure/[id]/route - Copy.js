import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to your NextAuth config

// ==========================================
// UTILITY: SECURE SESSION CHECK
// ==========================================
async function getSecureSession() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.schoolId) {
		throw new Error("UNAUTHORIZED");
	}
	return session;
}

// ==========================================
// UPDATE: Modify an existing fee structure
// ==========================================
export async function PUT(req, { params }) {
	try {
		const session = await getSecureSession();
		const { id } = params;
		const body = await req.json();

		// 1. Fetch the existing record to verify ownership
		const existingRecord = await prisma.feeStructure.findUnique({
			where: { id: parseInt(id) },
		});

		// 2. SECURITY CHECK: Does this record exist, and does it belong to the logged-in school?
		if (
			!existingRecord ||
			existingRecord.schoolId !== session.user.schoolId
		) {
			return NextResponse.json(
				{ error: "Record not found or unauthorized access" },
				{ status: 403 },
			);
		}

		// 3. Safe to update
		const updatedStructure = await prisma.feeStructure.update({
			where: { id: parseInt(id) },
			data: {
				className: body.className,
				academicYear: body.academicYear,
				tuitionFee: body.tuitionFee,
				libraryFee: body.libraryFee,
				transportFee: body.transportFee,
				activityFee: body.activityFee,
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

// ==========================================
// DELETE: Remove a fee structure
// ==========================================
export async function DELETE(req, { params }) {
	try {
		const session = await getSecureSession();
		const { id } = params;

		// 1. Fetch the existing record to verify ownership
		const existingRecord = await prisma.feeStructure.findUnique({
			where: { id: parseInt(id) },
		});

		// 2. SECURITY CHECK: Does this record exist, and does it belong to the logged-in school?
		if (
			!existingRecord ||
			existingRecord.schoolId !== session.user.schoolId
		) {
			return NextResponse.json(
				{ error: "Record not found or unauthorized access" },
				{ status: 403 },
			);
		}

		// 3. Safe to delete
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

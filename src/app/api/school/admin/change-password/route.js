import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";



export async function POST(request) {
	try {
		const { currentPassword, newPassword } = await request.json();

		// 1. Get current logged-in user ID (Placeholder: using an email for now)
		const adminEmail = "principal.sarah@greenwood.edu.in"; // Replace with Session/JWT email

		// 2. Fetch user from DB
		const admin = await prisma.admin.findUnique({
			where: { email: adminEmail },
		});

		if (!admin) {
			return NextResponse.json(
				{ error: "Admin not found" },
				{ status: 404 },
			);
		}

		// 3. Verify current password
		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			admin.passwordHash,
		);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Incorrect current password" },
				{ status: 401 },
			);
		}

		// 4. Hash the new password
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		// 5. Save new password to DB
		await prisma.admin.update({
			where: { email: adminEmail },
			data: {
				passwordHash: hashedNewPassword,
			},
		});

		return NextResponse.json(
			{ message: "Password updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error changing password:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

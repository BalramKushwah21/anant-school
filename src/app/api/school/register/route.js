import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";



export async function POST(request) {
	try {
		// 1. Frontend se form data receive karein
		// Isme School Information aur Administrator Information shamil hain
		const data = await request.json();

		const {
			schoolName,
			subdomain, // e.g., 'dps-delhi'
			schoolType, // e.g., 'K-12'
			udiseCode,
			phone,
			schoolEmail,
			city,
			district,
			state,
			address,
			pincode,

			// Admin Details
			adminName,
			adminEmail,
			adminPassword,
		} = data;

		// 2. Validation: Check karein ki email ya UDISE code pehle se register toh nahi
		const existingSchool = await prisma.school.findFirst({
			where: {
				OR: [
					{ subdomain: subdomain },
					{ udiseCode: udiseCode },
					{ email: schoolEmail },
				],
			},
		});

		if (existingSchool) {
			return NextResponse.json(
				{
					error: "School with this Subdomain, UDISE Code, or Email already exists.",
				},
				{ status: 400 },
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: adminEmail },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Administrator email is already registered." },
				{ status: 400 },
			);
		}

		// 3. Password Hashing (Security)
		const hashedPassword = await bcrypt.hash(adminPassword, 10);

		// 4. THE PRISMA TRANSACTION (Data Isolation Logic)
		// Yeh ensure karega ki dono (School aur Admin) ek hi waqt par database me create hon
		const result = await prisma.$transaction(async (tx) => {
			// Step A: Pehle School table me ek naya record banega
			const newSchool = await tx.school.create({
				data: {
					schoolName,
					subdomain,
					schoolType,
					adminName,
					udiseCode,
					phone,
					email: schoolEmail,
					city,
					district,
					state,
					address,
					pincode,
					subscriptionPlan: "BASIC", // Default plan
				},
			});

			// Step B: Usi waqt, User table me ek naya admin create hoga
			// Sabse important, us user ko newly generated schoolId assign kar diya jayega
			const newAdmin = await tx.user.create({
				data: {
					name: adminName,
					email: adminEmail,
					password: hashedPassword,
					userRole: "ADMIN", // Role-Based Access Control
					schoolId: newSchool.id, // Strict Data Isolation Guarantee
				},
			});

			return { newSchool, newAdmin };
		});

		// 5. Success Response
		return NextResponse.json(
			{
				success: true,
				message: "School and Admin successfully registered!",
				tenantId: result.newSchool.id,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Registration Error:", error);
		return NextResponse.json(
			{ error: "Something went wrong during registration." },
			{ status: 500 },
		);
	}
}

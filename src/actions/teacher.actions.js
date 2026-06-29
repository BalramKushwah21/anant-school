"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function registerTeacher(formData) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user.schoolId) {
		return { error: "Unauthorized access" };
	}

	try {
		// 1. Password Hash karo
		const hashedPassword = await bcrypt.hash(formData.password, 10);

		// 2. Transaction: User aur Teacher dono ek sath create honge
		const result = await prisma.$transaction(
			async (tx) => {
				// Step A: User account create karo
				const user = await tx.user.create({
					data: {
						name: `${formData.firstName} ${formData.lastName}`,
						username: formData.username,
						email: formData.email,
						password: hashedPassword,
						userRole: "TEACHER",
						schoolId: session.user.schoolId,
					},
				});

				// Step B: Teacher profile create karo aur user ko link karo
				const teacher = await tx.teacher.create({
					data: {
						schoolId: session.user.schoolId,
						userId: user.id,
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						phone: formData.phone,
						employeeId: formData.employeeId,
						designation: formData.designation,
						department: formData.department,
						dateOfBirth: new Date(formData.dob),
						qualification: formData.qualification,
						experienceYears: parseInt(formData.experience) || 0,

						// Yahan field add kari hai:
						dateOfJoining: new Date(formData.dateOfJoining),

						gender: formData.gender,
						// Salary ko Database ke liye convert karna
						basicSalary: parseFloat(formData.basicSalary) || 0,

						// Baaki fields...
						bankName: formData.bankName,
						accountNumber: formData.accountNumber,
						ifscCode: formData.ifscCode,
						panNumber: formData.panNumber,
						isClassTeacher: formData.isClassTeacher, // Boolean value
					},
				});
				return teacher;
			},
			{
				maxWait: 5000, // DB connection pool ke liye 5 seconds wait karega [cite: 309]
				timeout: 20000,
			},
		);

		// ✅ FIX APPLIED HERE: Next.js Client Component ke liye Data ko Plain/Safe banana
		const safeData = {
			...result,
			// Decimal object ko normal Number mein badalna
			basicSalary: result.basicSalary ? Number(result.basicSalary) : 0,

			// Date objects ko String (ISO format) mein badalna taaki error na aaye
			dateOfBirth: result.dateOfBirth
				? result.dateOfBirth.toISOString()
				: null,
			dateOfJoining: result.dateOfJoining
				? result.dateOfJoining.toISOString()
				: null,
			createdAt: result.createdAt ? result.createdAt.toISOString() : null,
			updatedAt: result.updatedAt ? result.updatedAt.toISOString() : null,
		};

		return { success: true, data: safeData };
	} catch (error) {
		console.error("Registration Error:", error);
		return {
			error: "Failed to register teacher. Please check if Employee ID or Email already exists.",
		};
	}
}

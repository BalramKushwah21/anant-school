import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
	try {
		const body = await req.json();
		const {
			schoolName,
			subdomain,
			schoolType,
			udiseCode,
			phone,
			schoolEmail,
			address,
			city,
			district,
			state,
			pincode,
			adminName,
			adminEmail,
			adminPassword,
			subscriptionPlan,
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
		} = body;

		// 1. Verify Razorpay Signature (Security Check)
		if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
			return NextResponse.json(
				{ error: "Payment details missing." },
				{ status: 400 },
			);
		}

		const generatedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(`${razorpay_order_id}|${razorpay_payment_id}`)
			.digest("hex");

		if (generatedSignature !== razorpay_signature) {
			return NextResponse.json(
				{
					error: "Payment verification failed! Security breach detected.",
				},
				{ status: 400 },
			);
		}

		// 2. Check for Duplicates
		const existingSchool = await prisma.school.findFirst({
			where: { OR: [{ subdomain: subdomain }, { email: schoolEmail }] },
		});

		if (existingSchool) {
			return NextResponse.json(
				{ error: "Subdomain or Email already registered." },
				{ status: 400 },
			);
		}

		// 3. Hash Admin Password
		const hashedPassword = await bcrypt.hash(adminPassword, 10);

		// Map plan IDs to amounts based on your frontend Pricing logic
		const planPrices = {
			BASIC: 299,
			STANDARD: 999,
			PREMIUM: 1499,
		};
		const paidAmount = planPrices[subscriptionPlan] || 0;

		// 4. Execute Prisma Transaction (All or Nothing)
		const newRegistration = await prisma.$transaction(async (tx) => {
			// A. Create School
			const school = await tx.school.create({
				data: {
					schoolName: schoolName,
					subdomain: subdomain,
					schoolType: schoolType,
					udiseCode: udiseCode,
					phone: phone,
					email: schoolEmail,
					address: address,
					city: city,
					district: district,
					state: state,
					pincode: pincode,
					subscriptionPlan: subscriptionPlan,
					isActive: true,
				},
			});

			// B. Create Admin User
			await tx.user.create({
				data: {
					schoolId: school.id,
					name: adminName,
					email: adminEmail,
					password: hashedPassword,
					userRole: "ADMIN",
				},
			});

			// C. Record the Subscription Payment
			await tx.subscriptionTransaction.create({
				data: {
					schoolId: school.id,
					planName: subscriptionPlan,
					amount: paidAmount,
					billingCycle: "MONTHLY",
					status: "SUCCESS",
					razorpayOrderId: razorpay_order_id,
					razorpayPaymentId: razorpay_payment_id,
					razorpaySignature: razorpay_signature,
				},
			});

			return school;
		});

		return NextResponse.json(
			{
				success: true,
				message:
					"Subscription active & School registered successfully!",
				school: newRegistration,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Subscription Registration Error:", error);

		// Handle specific Prisma Unique Constraint errors gracefully
		if (error.code === "P2002") {
			return NextResponse.json(
				{ error: "A record with this data already exists." },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process registration. Please contact support.",
			},
			{ status: 500 },
		);
	}
}

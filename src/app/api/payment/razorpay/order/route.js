import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay with your backend keys
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID, // Use environment variables
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
	try {
		const { amount } = await req.json();

		if (!amount || amount <= 0) {
			return NextResponse.json(
				{ error: "Invalid payment amount" },
				{ status: 400 },
			);
		}

		// Razorpay accepts amount in paise (₹1 = 100 paise)
		const options = {
			amount: Math.round(Number(amount)*100), // Convert to paise
			currency: "INR",
			receipt: `rcpt_school_reg_${Date.now()}`.slice(0, 40),
		};

		const order = await razorpay.orders.create(options);

		return NextResponse.json(
			{
				success: true,
				orderId: order.id,
				amount: order.amount,
				currency: order.currency,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Razorpay Order Error:", error);
		return NextResponse.json(
			{ error: "Failed to initialize payment with Razorpay." },
			{ status: 500 },
		);
	}
}

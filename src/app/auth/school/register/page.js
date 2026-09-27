"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Script from "next/script"; // Required for Razorpay
import {
	Building2,
	MapPin,
	User,
	CheckCircle2,
	ChevronRight,
	ChevronLeft,
	Loader2,
	WalletCards,
	Check,
} from "lucide-react";

// SaaS Subscription Plans
const SUBSCRIPTION_PLANS = [
	{
		id: "BASIC",
		name: "Basic Plan",
		price: 1, // ₹0.1 for testing; change to 299 for production
		desc: "Up to 100 Students",
		features: ["Core Modules", "Email Support"],
	},
	{
		id: "STANDARD",
		name: "Standard Plan",
		price: 999,
		desc: "Up to 500 Students",
		features: ["All Modules", "Priority Support"],
	},
	{
		id: "PREMIUM",
		name: "Premium Plan",
		price: 1499,
		desc: "Up to 1000 Students",
		features: ["Dedicated Account Manager", "Custom Reports"],
	},
];

export default function RegistrationPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	// State for Subscription Plan
	const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[0]);

	// Form state
	const [formData, setFormData] = useState({
		schoolName: "",
		subdomain: "",
		schoolType: "K-12",
		udiseCode: "",
		phone: "",
		schoolEmail: "",
		address: "",
		city: "",
		district: "",
		state: "",
		pincode: "",
		adminName: "",
		adminEmail: "",
		adminPassword: "",
		subscriptionPlan: "BASIC", // Default
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleNext = () => setStep((prev) => prev + 1);
	const handleBack = () => {
		setError(""); // Clear any payment errors when going back
		setStep((prev) => prev - 1);
	};

	// STEP 4: Razorpay Payment & Registration Logic
	const handlePaymentAndRegister = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			// 1. Backend se Order ID generate karwayein
			const orderRes = await fetch("/api/payment/razorpay/order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ amount: selectedPlan.price }),
			});
			const orderData = await orderRes.json();

			if (!orderRes.ok) {
				throw new Error(
					orderData.error || "Failed to initialize payment",
				);
			}

			// 2. Razorpay Checkout Modal Open karein
			const options = {
				key: process.env.RAZORPAY_KEY_ID, // Public Key
				amount: orderData.amount,
				currency: orderData.currency,
				name: "Anant School SaaS",
				description: `${selectedPlan.name} Subscription`,
				order_id: orderData.orderId,
				prefill: {
					name: formData.adminName,
					email: formData.adminEmail,
					contact: formData.phone,
				},
				theme: {
					color: "#2563eb",
				},
				handler: async function (response) {
					// ==========================================
					// PAYMENT SUCCESS! Ab School Data Save karein
					// ==========================================
					try {
						const finalData = {
							...formData,
							subscriptionPlan: selectedPlan.id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_order_id: response.razorpay_order_id,
							razorpay_signature: response.razorpay_signature,
						};

						const regRes = await fetch("/api/school/register", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(finalData),
						});

						const regData = await regRes.json();

						if (!regRes.ok) {
							throw new Error(
								regData.error ||
									"Registration failed after payment",
							);
						}

						setSuccess(true);
						setTimeout(() => router.push("/auth/login"), 2000);
					} catch (err) {
						setError(
							err.message ||
								"Payment verified but registration failed. Please contact support.",
						);
						setIsSubmitting(false);
					}
				},
				modal: {
					ondismiss: function () {
						// User ne Modal close kar diya bina pay kiye
						setError("Payment cancelled. Please try again.");
						setIsSubmitting(false);
					},
				},
			};

			const rzp = new window.Razorpay(options);

			// Payment Failure Listener
			rzp.on("payment.failed", function (response) {
				setError(`Payment failed: ${response.error.description}`);
				setIsSubmitting(false);
			});

			rzp.open();
		} catch (err) {
			setError(err.message);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			{/* Razorpay Script Load */}
			<Script
				id="razorpay-checkout-js"
				src="https://checkout.razorpay.com/v1/checkout.js"
			/>

			<div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				{/* Header & Stepper */}
				<div className="bg-blue-600 px-8 py-6 text-white">
					<h2 className="text-3xl font-extrabold tracking-tight">
						Join Anant School
					</h2>
					<p className="mt-2 text-blue-100">
						Digitize your school operations in minutes.
					</p>

					<div className="mt-8 flex items-center justify-between relative">
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-blue-400 rounded"></div>
						<div
							className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white rounded transition-all duration-500"
							style={{ width: `${((step - 1) / 3) * 100}%` }}
						></div>

						{[1, 2, 3, 4].map((num) => (
							<div
								key={num}
								className={`relative flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors duration-300 ${step >= num ? "bg-white text-blue-600 shadow-md" : "bg-blue-400 text-blue-100"}`}
							>
								{num === 1 && <Building2 size={20} />}
								{num === 2 && <MapPin size={20} />}
								{num === 3 && <User size={20} />}
								{num === 4 && <WalletCards size={20} />}
							</div>
						))}
					</div>
				</div>

				{/* Form Area */}
				<div className="px-8 py-10 relative overflow-hidden min-h-100">
					{error && (
						<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
							<span>{error}</span>
							<button
								onClick={() => setError("")}
								className="text-red-500 hover:text-red-700 text-xl font-bold"
							>
								&times;
							</button>
						</div>
					)}

					{success ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="flex flex-col items-center justify-center h-full text-center py-10"
						>
							<CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
							<h3 className="text-2xl font-bold text-gray-900">
								Registration Successful!
							</h3>
							<p className="text-gray-500 mt-2">
								Redirecting you to the login page...
							</p>
						</motion.div>
					) : (
						<AnimatePresence mode="wait">
							<motion.div
								key={step}
								initial={{ x: 50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -50, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<form
									onSubmit={
										step === 4
											? handlePaymentAndRegister
											: (e) => {
													e.preventDefault();
													handleNext();
												}
									}
								>
									{/* STEP 1: School Details (Unchanged) */}
									{step === 1 && (
										<div className="space-y-5">
											<div>
												<label className="block text-sm font-medium text-gray-700">
													School Name
												</label>
												<input
													type="text"
													required
													name="schoolName"
													value={formData.schoolName}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
													placeholder="Delhi Public School"
												/>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
												<div>
													<label className="block text-sm font-medium text-gray-700">
														Subdomain (Unique)
													</label>
													<input
														type="text"
														required
														name="subdomain"
														value={
															formData.subdomain
														}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="dps-delhi"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														UDISE Code
													</label>
													<input
														type="text"
														required
														name="udiseCode"
														value={
															formData.udiseCode
														}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="09123456789"
													/>
												</div>
											</div>
										</div>
									)}

									{/* STEP 2: Address & Contact (Unchanged) */}
									{step === 2 && (
										// ... (Your existing Step 2 code here)
										<div className="space-y-5">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
												<div>
													<label className="block text-sm font-medium text-gray-700">
														School Email
													</label>
													<input
														type="email"
														required
														name="schoolEmail"
														value={
															formData.schoolEmail
														}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="info@school.com"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														Phone Number
													</label>
													<input
														type="text"
														required
														name="phone"
														value={formData.phone}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
														placeholder="+91 9876543210"
													/>
												</div>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Complete Address
												</label>
												<input
													type="text"
													required
													name="address"
													value={formData.address}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="Sector 14, Main Road"
												/>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
												<div>
													<label className="block text-sm font-medium text-gray-700">
														City
													</label>
													<input
														type="text"
														required
														name="city"
														value={formData.city}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														State
													</label>
													<input
														type="text"
														required
														name="state"
														value={formData.state}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700">
														Pincode
													</label>
													<input
														type="text"
														required
														name="pincode"
														value={formData.pincode}
														onChange={handleChange}
														className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													/>
												</div>
											</div>
										</div>
									)}

									{/* STEP 3: Admin Setup (Unchanged) */}
									{step === 3 && (
										// ... (Your existing Step 3 code here)
										<div className="space-y-5">
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Admin/Principal Name
												</label>
												<input
													type="text"
													required
													name="adminName"
													value={formData.adminName}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="Dr. Sharma"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Admin Login Email
												</label>
												<input
													type="email"
													required
													name="adminEmail"
													value={formData.adminEmail}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="admin@school.com"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Secure Password
												</label>
												<input
													type="password"
													required
													name="adminPassword"
													value={
														formData.adminPassword
													}
													onChange={handleChange}
													className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
													placeholder="••••••••"
												/>
											</div>
										</div>
									)}

									{/* STEP 4: Subscription Plans & Payment */}
									{step === 4 && (
										<div className="space-y-6">
											<div className="text-center mb-6">
												<h3 className="text-xl font-bold text-gray-800">
													Select a Subscription Plan
												</h3>
												<p className="text-gray-500 text-sm">
													Choose the best plan for{" "}
													{formData.schoolName ||
														"your school"}
													.
												</p>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												{SUBSCRIPTION_PLANS.map(
													(plan) => (
														<div
															key={plan.id}
															onClick={() =>
																setSelectedPlan(
																	plan,
																)
															}
															className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
																selectedPlan.id ===
																plan.id
																	? "border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]"
																	: "border-gray-200 bg-white hover:border-blue-300"
															}`}
														>
															{selectedPlan.id ===
																plan.id && (
																<div className="absolute top-3 right-3 text-blue-600">
																	<CheckCircle2
																		size={
																			24
																		}
																		fill="currentColor"
																		className="text-white"
																	/>
																</div>
															)}
															<h4 className="font-bold text-gray-900 text-lg">
																{plan.name}
															</h4>
															<div className="mt-2 flex items-baseline gap-1">
																<span className="text-2xl font-extrabold text-blue-600">
																	₹
																	{plan.price}
																</span>
																<span className="text-xs text-gray-500">
																	/month
																</span>
															</div>
															<p className="text-sm font-semibold text-gray-700 mt-2">
																{plan.desc}
															</p>
															<ul className="mt-4 space-y-2">
																{plan.features.map(
																	(
																		feat,
																		idx,
																	) => (
																		<li
																			key={
																				idx
																			}
																			className="flex items-center text-xs text-gray-600"
																		>
																			<Check
																				size={
																					14
																				}
																				className="text-green-500 mr-2"
																			/>
																			{
																				feat
																			}
																		</li>
																	),
																)}
															</ul>
														</div>
													),
												)}
											</div>
										</div>
									)}

									{/* Navigation Buttons */}
									<div className="mt-10 flex justify-between items-center border-t border-gray-100 pt-6">
										{step > 1 ? (
											<button
												type="button"
												onClick={handleBack}
												disabled={isSubmitting}
												className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
											>
												<ChevronLeft className="w-4 h-4 mr-1" />{" "}
												Back
											</button>
										) : (
											<div></div>
										)}

										<button
											type="submit"
											disabled={isSubmitting}
											className="flex items-center px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-blue-400"
										>
											{step === 4 ? (
												isSubmitting ? (
													<>
														<Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
														Processing Payment...
													</>
												) : (
													`Pay ₹${selectedPlan.price} & Register`
												)
											) : (
												<>
													Next Step{" "}
													<ChevronRight className="w-4 h-4 ml-1" />
												</>
											)}
										</button>
									</div>
								</form>
							</motion.div>
						</AnimatePresence>
					)}
				</div>
			</div>
		</div>
	);
}

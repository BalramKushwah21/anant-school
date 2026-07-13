"use client";

import React, { useState } from "react";
import {
	Mail,
	Phone,
	MapPin,
	Send,
	MessageCircle,
	Building2,
	Loader2,
	Globe,
} from "lucide-react";

export default function BrandingContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		schoolName: "",
		inquiryType: "Request a Demo",
		contactNumber: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Replace with your actual WhatsApp Sales/Support Number (Include Country Code)
	const WHATSAPP_NUMBER = "9285022678";

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleWhatsAppSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// 1. Save Lead to your Database (Optional but Recommended)
			// Make sure your /api/contact route accepts these updated fields
			await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					role: formData.inquiryType, // Mapping inquiryType to your DB 'role' column
					message: `Contact: ${formData.contactNumber} - ${formData.message}`,
				}),
			});

			// 2. Format message for WhatsApp Lead
			const whatsappText = `Hello School Grid Team! 👋%0A%0A*Name:* ${formData.name}%0A*Contact:* ${formData.contactNumber}%0A*Inquiry:* ${formData.inquiryType}%0A*Message:* ${formData.message}`;
			const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

			// 3. Open WhatsApp
			window.open(whatsappUrl, "_blank");

			// 4. Reset Form
			setFormData({
				name: "",
				schoolName: "",
				inquiryType: "Request a Demo",
				contactNumber: "",  
				message: "",
			});
		} catch (error) {
			console.error("Submission error:", error);
			alert("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 font-sans">
			{/* SaaS Branding Header */}
			<div className="max-w-3xl w-full text-center mb-16">
				<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
					Let's transform your school.
				</h1>
				<p className="text-xl text-slate-600">
					Whether you want a live demo, need custom pricing, or
					require technical support, the School Grid team is just a
					message away.
				</p>
			</div>

			<div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">
				{/* Left Side: Premium Contact Info Box */}
				<div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-10 lg:col-span-2 text-white flex flex-col justify-between relative overflow-hidden">
					{/* Abstract Background Decoration */}
					<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>

					<div className="relative z-10">
						<h2 className="text-3xl font-bold mb-6">
							Contact Sales & Support
						</h2>
						<p className="text-indigo-200 mb-10 text-lg">
							Experience the power of India's most advanced
							multi-tenant School ERP.
						</p>

						<div className="space-y-8">
							<div className="flex items-start space-x-4">
								<Phone className="w-6 h-6 text-indigo-300 mt-1" />
								<div>
									<p className="font-semibold text-lg">
										Phone / WhatsApp
									</p>
									<p className="text-indigo-200">
										+91 92850 22678
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-4">
								<Mail className="w-6 h-6 text-indigo-300 mt-1" />
								<div>
									<p className="font-semibold text-lg">
										Email Us
									</p>
									<p className="text-indigo-200">
										bkushwah1081@gmail.com
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-4">
								<MapPin className="w-6 h-6 text-indigo-300 mt-1" />
								<div>
									<p className="font-semibold text-lg">
										Address
									</p>
									<p className="text-indigo-200">
										Bhopal, Madhya Pradesh
										<br />
										India
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-16 relative z-10 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
						<div className="flex items-center space-x-3 text-indigo-100">
							<Globe className="w-5 h-5 text-green-400" />
							<span className="font-medium">
								Online & Ready to Help
							</span>
						</div>
					</div>
				</div>

				{/* Right Side: Lead Generation Form */}
				<div className="p-10 lg:p-12 lg:col-span-3">
					<h2 className="text-2xl font-bold text-slate-900 mb-8">
						Send us a direct message
					</h2>

					<form onSubmit={handleWhatsAppSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Full Name */}
							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">
									Full Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-slate-50 focus:bg-white"
									placeholder="e.g. Rahul Sharma"
								/>
							</div>

							{/* School Name */}
							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">
									School / Institute Name
								</label>
								<div className="relative">
									<Building2 className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
									<input
										type="text"
										name="schoolName"
										value={formData.schoolName}
										onChange={handleChange}
										required
										className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-slate-50 focus:bg-white"
										placeholder="e.g. Anant Public School"
									/>
								</div>
							</div>
							{/* Contact*/}
							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">
									Contact / WhatsApp Number
								</label>
								<div className="relative">
									<Building2 className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
									<input
										type="text"
										name="contactNumber"
										value={formData.contactNumber}
										onChange={handleChange}
										required
										className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-slate-50 focus:bg-white"
										placeholder="e.g. +91 XXXXX XXXXX"
									/>
								</div>
							</div>
							{/* Inquiry Type */}
							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">
									What can we help you with?
								</label>
								<select
									name="inquiryType"
									value={formData.inquiryType}
									onChange={handleChange}
									className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-slate-50 focus:bg-white"
								>
									<option value="Request a Demo">
										I want a Live Demo
									</option>
									<option value="Pricing Inquiry">
										I need Pricing Information
									</option>
									<option value="Technical Support">
										I need Technical Support
									</option>
									<option value="Partnership">Other</option>
								</select>
							</div>
						</div>

						{/* Message */}
						<div>
							<label className="block text-sm font-semibold text-slate-700 mb-2">
								Your Message
							</label>
							<textarea
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
								rows="4"
								className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
								placeholder="Tell us a bit about your school's requirements..."
							></textarea>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-lg py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-200 disabled:opacity-70 transform hover:-translate-y-0.5"
						>
							{isSubmitting ? (
								<Loader2 className="w-6 h-6 animate-spin" />
							) : (
								<MessageCircle className="w-6 h-6" />
							)}
							<span>
								{isSubmitting
									? "Connecting..."
									: "Chat with us on WhatsApp"}
							</span>
						</button>
						<p className="text-center text-sm text-slate-500 mt-4">
							We typically reply within a few minutes during
							business hours.
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}



import Link from "next/link";
// Keep the standard UI icons from Lucide
import { Mail, Phone, MapPin } from "lucide-react";

// Import the brand icons from React Icons (Feather set matches Lucide's style)
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
export default function HomePage() {

	const currentYear = new Date().getFullYear();
	const plans = [
		{
			students: "Up to 300 Students",
			monthly: "₹299",
			yearly: "₹2,999",
			featured: true,
		},
		{
			students: "upto 500 Students",
			monthly: "₹499",
			yearly: "₹4,999",
		},
		{
			students: "upto 800 Students",
			monthly: "₹799",
			yearly: "₹7,999",
		},
		{
			students: "upto 1000+ Students",
			monthly: "₹999",
			yearly: "₹9,999",
		},
	];

	return (
		<main className="bg-slate-950 text-white min-h-screen">
			{/* Hero Section */}
			<section className="container mx-auto px-6 py-24">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm">
							School Management SaaS
						</span>

						<h1 className="text-5xl md:text-7xl font-bold mt-6 leading-tight">
							Run Your Entire School From
							<span className="text-blue-500"> One Platform</span>
						</h1>

						<p className="text-slate-400 mt-6 text-lg">
							Admissions, Attendance, Fees, Examinations,
							Communication and Reports — everything your school
							needs in one secure cloud-based system.
						</p>

						<div className="flex gap-4 mt-8 flex-wrap">
							<Link
								href="/auth/school/register"
								className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium"
							>
								Register School
							</Link>

							<a
								href="#demo"
								className="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-xl"
							>
								Watch Demo
							</a>
							<Link
								href="/auth/login"
								className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium"
							>
								Login
							</Link>
						</div>
					</div>

					<div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
						<h3 className="text-xl font-semibold mb-6">
							SchoolGrid Dashboard
						</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="bg-slate-800 p-5 rounded-xl">
								<p className="text-slate-400">
									Registered Schools
								</p>
								<h4 className="text-3xl font-bold">N/A</h4>
							</div>

							<div className="bg-slate-800 p-5 rounded-xl">
								<p className="text-slate-400">
									Total Registered Student
								</p>
								<h4 className="text-3xl font-bold">N/A</h4>
							</div>

							<div className="bg-slate-800 p-5 rounded-xl">
								<p className="text-slate-400">Revenue</p>
								<h4 className="text-3xl font-bold">N/A</h4>
							</div>

							<div className="bg-slate-800 p-5 rounded-xl">
								<p className="text-slate-400">
									Total Registered Teachers
								</p>
								<h4 className="text-3xl font-bold">N/A</h4>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="container mx-auto px-6 py-24">
				<h2 className="text-4xl font-bold text-center">
					Everything Your School Needs
				</h2>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
					{[
						"Student Management",
						"Attendance Tracking",
						"Fee Management",
						"Examination System",
						"Parent Portal",
						"Teacher Portal",
						"Reports & Analytics",
						"Cloud Backup",
					].map((feature) => (
						<div
							key={feature}
							className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
						>
							{feature}
						</div>
					))}
				</div>
			</section>

			{/* Demo */}
			<section id="demo" className="bg-slate-900 py-24 px-6 text-center">
				<h2 className="text-4xl font-bold">See SchoolGrid In Action</h2>

				<p className="text-slate-400 mt-4">
					Explore how SchoolGrid simplifies school management.
				</p>

				<div className="max-w-4xl mx-auto mt-10 aspect-video bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center">
					<button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl">
						▶ Watch Demo
					</button>
				</div>
			</section>

			{/* Pricing */}
			<section className="container mx-auto px-6 py-24">
				<h2 className="text-4xl font-bold text-center">
					Pricing Plans
				</h2>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
					{plans.map((plan) => (
						<div
							key={plan.students}
							className={`rounded-3xl p-8 border ${
								plan.featured
									? "border-blue-500 bg-blue-500/10"
									: "border-slate-800 bg-slate-900"
							}`}
						>
							{plan.featured && (
								<div className="bg-blue-600 inline-block px-3 py-1 rounded-full text-sm mb-4">
									Most Popular
								</div>
							)}

							<h3 className="font-bold text-xl">
								{plan.students}
							</h3>

							<div className="mt-6">
								<p className="text-slate-400">Monthly</p>
								<h4 className="text-4xl font-bold">
									{plan.monthly}
								</h4>
							</div>

							<div className="mt-4">
								<p className="text-slate-400">Yearly</p>
								<h4 className="text-2xl font-bold">
									{plan.yearly}
								</h4>
							</div>

							<Link
								href="/register-school"
								className="block text-center mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
							>
								Get Started
							</Link>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 py-24 text-center">
				<h2 className="text-5xl font-bold">
					Ready to Digitize Your School?
				</h2>

				<p className="mt-4 text-white/80">
					Join schools already simplifying administration with Anant
					School.
				</p>

				<Link
					href="/auth/school/register"
					className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-xl font-semibold"
				>
					Register Your School
				</Link>
			</section>
			<footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 mt-auto">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* 1. Brand Section */}
						<div className="col-span-1">
							<Link
								href="/"
								className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"
							>
								<div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
									<span className="text-white font-black text-xl">
										S
									</span>
								</div>
								Anant School
							</Link>
							<p className="mt-4 text-sm text-gray-400 leading-relaxed">
								The ultimate multi-tenant Cloud-based School
								Management System. Streamline your school's
								administration, automate student admissions, and
								manage fees from a single powerful platform.
							</p>
							<div className="flex mt-6 space-x-4">
								<a
									href="#"
									className="text-gray-400 hover:text-indigo-400 transition-colors"
								>
									<FiFacebook className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-indigo-400 transition-colors"
								>
									<FiTwitter className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-indigo-400 transition-colors"
								>
									<FiInstagram className="w-5 h-5" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-indigo-400 transition-colors"
								>
									<FiLinkedin className="w-5 h-5" />
								</a>
							</div>
						</div>

						{/* 2. Product & Quick Links */}
						<div>
							<h3 className="text-sm font-semibold text-white uppercase tracking-wider">
								Product
							</h3>
							<ul className="mt-4 space-y-3">
								<li>
									<Link
										href="/features"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Features & Modules
									</Link>
								</li>
								<li>
									<Link
										href="/pricing"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Pricing Plans
									</Link>
								</li>
								<li>
									<Link
										href="/demo"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Book a Demo
									</Link>
								</li>
								<li>
									<Link
										href="/auth/login"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										School Login
									</Link>
								</li>
								<li>
									<Link
										href="/register"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Register Your School
									</Link>
								</li>
							</ul>
						</div>

						{/* 3. Legal & Resources */}
						<div>
							<h3 className="text-sm font-semibold text-white uppercase tracking-wider">
								Legal & Support
							</h3>
							<ul className="mt-4 space-y-3">
								<li>
									<Link
										href="/term-and-conditions/term-conditions"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Terms and Conditions
									</Link>
								</li>
								<li>
									<Link
										href="/term-and-conditions/privacy-policy"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href="/term-and-conditions/refund-and-cancelation"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Refund & Cancellation
									</Link>
								</li>
								<li>
									<Link
										href="/help-center"
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Help Center / Documentation
									</Link>
								</li>
							</ul>
						</div>

						{/* 4. Contact Info */}
						<div>
							<h3 className="text-sm font-semibold text-white uppercase tracking-wider">
								Contact Us
							</h3>
							<ul className="mt-4 space-y-4">
								<li className="flex items-center text-sm text-gray-400">
									<Mail className="w-4 h-4 mr-3 text-indigo-500" />
									<a
										href="mailto:support@schoolgrid.in"
										className="hover:text-white transition-colors"
									>
										bkushwah1081@gmail.com
									</a>
								</li>
								<li className="flex items-center text-sm text-gray-400">
									<Phone className="w-4 h-4 mr-3 text-indigo-500" />
									<a
										href="tel:+919876543210"
										className="hover:text-white transition-colors"
									>
										+91 92850 22678
									</a>
								</li>
								<li className="flex items-start text-sm text-gray-400">
									<MapPin className="w-4 h-4 mr-3 mt-1 text-indigo-500 shrink-0" />
									<span>
										Press Colony,
										<br />
										Anand nagar, Bhopal, India
									</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-gray-400 text-center md:text-left">
							&copy; {currentYear} Anant School (SaaS). All rights
							reserved.
						</p>
						<div className="flex space-x-6 text-sm text-gray-400">
							<span className="flex items-center">
								<span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
								All Systems Operational
							</span>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}

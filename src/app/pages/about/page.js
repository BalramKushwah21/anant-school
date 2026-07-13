import React from "react";
import Link from "next/link";
import {
	Shield,
	Zap,
	Users,
	Target,
	Globe,
	Award,
	ArrowRight,
	CheckCircle2,
} from "lucide-react";

export default function AboutPage() {

    const Features = [
        "Automated Fee Management",
        "Dynamic Marksheet Generation",
        "Smart Attendance Tracking",
    ];
	// Statistics using "N/A" as requested
	const stats = [
		{ label: "Active Schools", value: "N/A" },
		{ label: "Students Managed", value: "N/A" },
		{ label: "Uptime SLA", value: "N/A" },
		{ label: "Support Satisfaction", value: "N/A" },
	];

	const values = [
		{
			icon: <Shield className="w-6 h-6 text-indigo-600" />,
			title: "Bank-Grade Security",
			description:
				"We employ strict multi-tenant data isolation and encryption to ensure student and financial records are never compromised.",
		},
		{
			icon: <Zap className="w-6 h-6 text-indigo-600" />,
			title: "Blazing Fast Performance",
			description:
				"Built on modern web architectures and optimized databases, Anant School is designed to load instantly, even with thousands of concurrent users.",
		},
		{
			icon: <Users className="w-6 h-6 text-indigo-600" />,
			title: "User-Centric Design",
			description:
				"We build features by listening to teachers and principals, ensuring our UI is intuitive and requires zero technical training.",
		},
		{
			icon: <Target className="w-6 h-6 text-indigo-600" />,
			title: "Continuous Innovation",
			description:
				"Education evolves, and so do we. We roll out free updates and new modules to keep your school ahead of the curve.",
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
			{/* 1. Hero Section */}
			<section className="relative pt-24 pb-32 overflow-hidden">
				{/* Background Gradients */}
				<div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-slate-900 z-0"></div>
				<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>{" "}
				{/* Optional grid background */}
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1.5 mb-8 border border-white/20 backdrop-blur-sm">
						<Globe className="w-4 h-4 text-indigo-300" />
						<span className="text-sm font-medium text-indigo-100">
							India's Next-Gen School ERP
						</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
						Empowering Education <br className="hidden md:block" />{" "}
						Through Technology.
					</h1>
					<p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
						Anant School was built with a singular vision: to
						eliminate administrative chaos so educators can focus on
						what truly matters—teaching.
					</p>
				</div>
			</section>

			{/* 2. Statistics Banner (Overlapping the Hero) */}
			<section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-2xl shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-8">
					{stats.map((stat, index) => (
						<div
							key={index}
							className="text-center py-4 md:py-0 px-4"
						>
							<p className="text-4xl font-black text-indigo-600 mb-2">
								{stat.value}
							</p>
							<p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* 3. The Story / Mission Section */}
			<section className="py-24 bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
								Why we built Anant School
							</h2>
							<div className="space-y-6 text-lg text-slate-600 leading-relaxed">
								<p>
									For too long, schools have been forced to
									rely on outdated, clunky software or messy
									spreadsheets to manage their day-to-day
									operations. We saw principals drowning in
									paperwork, teachers spending hours on
									attendance, and parents left in the dark.
								</p>
								<p>
									<strong>Anant School</strong> is our answer.
									We engineered a cloud-based, multi-tenant
									SaaS platform that brings enterprise-level
									technology to educational institutions of
									all sizes.
								</p>
								<ul className="space-y-3 mt-6">
									{Features.map((item, i) => (
										<li
											key={i}
											className="flex items-center text-slate-700"
										>
											<CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
											<span className="font-medium">
												{item}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Abstract Visual Representation instead of a generic stock photo */}
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
							<div className="relative bg-white p-8 rounded-3xl shadow-lg border border-slate-100 aspect-square flex flex-col justify-center items-center text-center">
								<div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
									<Award className="w-10 h-10 text-indigo-600" />
								</div>
								<h3 className="text-2xl font-bold text-slate-900 mb-4">
									Our Mission
								</h3>
								<p className="text-slate-600">
									To democratize access to premium educational
									software, making top-tier administrative
									tools affordable and accessible to every
									school in India.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 4. Core Values Section */}
			<section className="py-24 bg-white border-t border-slate-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
							Our Core Values
						</h2>
						<p className="text-lg text-slate-600">
							We don't just write code; we build trust. These are
							the principles that guide every update, module, and
							line of code we write for Anant School.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<div
								key={index}
								className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow duration-300 group"
							>
								<div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
									{value.icon}
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-3">
									{value.title}
								</h3>
								<p className="text-slate-600 leading-relaxed">
									{value.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 5. Call To Action */}
			<section className="py-20 bg-indigo-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
						Ready to transform your school?
					</h2>
					<p className="text-lg text-slate-600 mb-10">
						Join the growing network of forward-thinking schools
						using Anant School to manage their entire campus online.
					</p>
					
				</div>
			</section>
		</div>
	);
}

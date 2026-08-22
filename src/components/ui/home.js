import Link from "next/link";
import {
	Mail,
	Phone,
	MapPin,
	Users,
	ClipboardCheck,
	Wallet,
	FileText,
	MessageSquare,
	GraduationCap,
	BarChart3,
	Cloud,
	ArrowRight,
	Play,
	ShieldCheck,
} from "lucide-react";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
/*
    • Fonts (add once in app/layout.jsx, then pass the className down):
    • import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
    • const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
    • const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
    • const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-mono" });
    • Fraunces gives headlines a ledger/registrar warmth, Inter keeps body copy
    • legible, and IBM Plex Mono reads like typewritten record numbers. */
const FEATURES = [
	{
		icon: Users,
		title: "Student Records",
		copy: "One profile per student — admissions, guardians, and history in a single record.",
	},
	{
		icon: ClipboardCheck,
		title: "Attendance",
		copy: "Mark attendance in seconds. Parents see it the same day, automatically.",
	},
	{
		icon: Wallet,
		title: "Fee Collection",
		copy: "Send fee reminders, accept online payments, and reconcile receipts without spreadsheets.",
	},
	{
		icon: FileText,
		title: "Examinations",
		copy: "Build mark sheets and report cards that follow your school's own grading rules.",
	},
	{
		icon: MessageSquare,
		title: "Parent Portal",
		copy: "Parents check attendance, fees, and results without calling the front office.",
	},
	{
		icon: GraduationCap,
		title: "Teacher Portal",
		copy: "Teachers manage their own classes, marks, and timetables from one login.",
	},
	{
		icon: BarChart3,
		title: "Reports & Analytics",
		copy: "See attendance trends and fee collection at a glance — no manual tallying.",
	},
	{
		icon: Cloud,
		title: "Cloud Backup",
		copy: "Every record is backed up automatically. Nothing lives on a single office PC again.",
	},
];
const STATS = [
	{ label: "Registered Schools", value: "—" },
	{ label: "Students on Platform", value: "—" },
	{ label: "Fees Processed", value: "—" },
	{ label: "Teachers Onboarded", value: "—" },
];
const PLANS = [
	{ students: "Up to 300 students", monthly: "₹299", yearly: "₹2,999" },
	{
		students: "Up to 500 students",
		monthly: "₹499",
		yearly: "₹4,999",
		featured: true,
	},
	{ students: "Up to 800 students", monthly: "₹799", yearly: "₹7,999" },
	{ students: "1000+ students", monthly: "₹999", yearly: "₹9,999" },
];
export default function HomePage() {
	const currentYear = new Date().getFullYear();
	return (
		<main className="bg-[#0B1220] text-[#F3EFE3] font-(family-name:--font-body,ui-sans-serif) min-h-screen selection:bg-[#C9A227] selection:text-[#0B1220]">
			{/* ---------------------------------------------------------------- */}
			{/* Nav                                                               */}
			{/* ---------------------------------------------------------------- */}
			<header className="sticky top-0 z-50 border-b border-white/6 bg-[#0B1220]/85 backdrop-blur">
				<nav className="container mx-auto px-6 h-20 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-3 group">
						<span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]/60 text-[#C9A227] font-(family-name:--font-display,serif) text-lg group-hover:border-[#C9A227] transition-colors">
							अ
						</span>
						<span className="font-(family-name:--font-display,serif) text-xl tracking-tight">
							Anant School
						</span>
					</Link>

					<div className="hidden md:flex items-center gap-8 text-sm text-[#F3EFE3]/70">
						<Link
							href="#features"
							className="hover:text-[#F3EFE3] transition-colors"
						>
							Features
						</Link>
						<Link
							href="#pricing"
							className="hover:text-[#F3EFE3] transition-colors"
						>
							Pricing
						</Link>
						<Link
							href="/pages/about"
							className="hover:text-[#F3EFE3] transition-colors"
						>
							About
						</Link>
						<Link
							href="/pages/contact"
							className="hover:text-[#F3EFE3] transition-colors"
						>
							Contact
						</Link>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/auth/login"
							className=" sm:inline-block text-sm text-[#F3EFE3]/80 hover:text-[#F3EFE3] px-4 py-2 transition-colors bg-[#C9A227]/10 hover:bg-[#C9A227]/20 rounded-md font-semibold"
						>
							Log in
						</Link>
						<Link
							href="/auth/school/register"
							className="hidden sm:inline-block text-sm bg-[#C9A227] text-[#0B1220] hover:bg-[#E4C874] px-5 py-2.5 rounded-md font-semibold transition-colors"
						>
							Register school
						</Link>
					</div>
				</nav>
			</header>

			{/* ---------------------------------------------------------------- */}
			{/* Hero                                                              */}
			{/* ---------------------------------------------------------------- */}
			<section className="container mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<div className="animate-[fadeUp_0.7s_ease-out]">
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#C9A227] font-(family-name:--font-mono,monospace) border border-[#C9A227]/30 rounded-full px-3 py-1.5">
							<ShieldCheck className="w-3.5 h-3.5" />
							School management, digitized
						</span>

						<h1 className="font-(family-name:--font-display,serif) text-5xl md:text-6xl lg:text-7xl font-medium mt-7 leading-[1.05] tracking-tight">
							Run your entire
							<br />
							school from{" "}
							<span className="text-[#C9A227] italic">
								one platform
							</span>
							.
						</h1>

						<p className="text-[#F3EFE3]/60 mt-7 text-lg leading-relaxed max-w-lg">
							Admissions, attendance, fees, examinations, and
							communication — one cloud system, replacing the
							stack of registers on your office shelf.
						</p>

						<div className="flex gap-4 mt-10 flex-wrap items-center">
							<Link
								href="/auth/school/register"
								className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#E4C874] text-[#0B1220] px-6 py-3.5 rounded-md font-semibold transition-colors"
							>
								Register your school
								<ArrowRight className="w-4 h-4" />
							</Link>

							<a
								href="#demo"
								className="inline-flex items-center gap-2 border border-white/15 hover:border-white/35 px-6 py-3.5 rounded-md text-[#F3EFE3]/85 transition-colors"
							>
								<Play className="w-4 h-4" />
								Watch demo
							</a>
						</div>
					</div>

					{/* Signature element: the "ledger" dashboard card, ruled like a register book */}
					<div className="relative animate-[fadeUp_0.9s_ease-out_0.1s_both]">
						<div className="absolute -top-4 -right-4 flex h-20 w-20 rotate-6 items-center justify-center rounded-full border border-dashed border-[#C9A227]/50 text-center">
							<span className="font-(family-name:--font-mono,monospace) text-[9px] leading-tight tracking-widest text-[#C9A227] uppercase">
								Est. record
								<br />
								system
							</span>
						</div>

						<div className="bg-[#141D33] border border-white/8] rounded-2xl p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
							<div className="flex items-center justify-between border-b border-white/8] pb-4 mb-6">
								<h3 className="font-(family-name:--font-display,serif) text-lg">
									Anant School Register
								</h3>
								<span className="font-(family-name:--font-mono,monospace) text-[10px] uppercase tracking-widest text-[#F3EFE3]/40">
									Live
								</span>
							</div>

							<div className="grid grid-cols-2 gap-y-6">
								{STATS.map((stat, i) => (
									<div
										key={stat.label}
										className={`pr-4 ${i % 2 === 0 ? "border-r border-white/8]" : "pl-4"} ${
											i < 2
												? "pb-6 border-b border-white/8]"
												: ""
										}`}
									>
										<p className="text-[#F3EFE3]/45 text-xs uppercase tracking-wide">
											{stat.label}
										</p>
										<p className="font-(family-name:--font-mono,monospace) text-3xl mt-2 text-[#F3EFE3]">
											{stat.value}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ---------------------------------------------------------------- */}
			{/* Features                                                          */}
			{/* ---------------------------------------------------------------- */}
			<section id="features" className="border-t border-white/6]">
				<div className="container mx-auto px-6 py-24">
					<div className="max-w-xl">
						<span className="font-(family-name:--font-mono,monospace) text-xs uppercase tracking-[0.2em] text-[#C9A227]">
							What's included
						</span>
						<h2 className="font-(family-name:--font-display,serif) text-4xl md:text-5xl mt-4 leading-tight">
							Everything your front office does by hand, today
						</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6 mt-16 rounded-2xl overflow-hidden">
						{FEATURES.map(({ icon: Icon, title, copy }) => (
							<div
								key={title}
								className="bg-[#0B1220] p-7 hover:bg-[#141D33] transition-colors group"
							>
								<Icon className="w-6 h-6 text-[#C9A227] group-hover:scale-110 transition-transform" />
								<h3 className="font-medium mt-5">{title}</h3>
								<p className="text-[#F3EFE3]/50 text-sm mt-2 leading-relaxed">
									{copy}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ---------------------------------------------------------------- */}
			{/* Demo                                                              */}
			{/* ---------------------------------------------------------------- */}
			<section
				id="demo"
				className="border-t border-white/6] bg-[#141D33] py-24 px-6 text-center"
			>
				<span className="font-(family-name:--font-mono,monospace) text-xs uppercase tracking-[0.2em] text-[#C9A227]">
					Two minutes, start to finish
				</span>
				<h2 className="font-[family-name:--font-display,serif) text-4xl md:text-5xl mt-4">
					See Anant School in action
				</h2>
				<p className="text-[#F3EFE3]/55 mt-4 max-w-md mx-auto">
					A walkthrough of admissions, attendance, and fee collection,
					recorded in a real school office.
				</p>

				<button className="group relative max-w-4xl w-full mx-auto mt-12 aspect-video bg-[#0B1220] border border-white/8] rounded-2xl flex items-center justify-center overflow-hidden">
					<div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(0deg,#F3EFE3_0,#F3EFE3_1px,transparent_1px,transparent_28px)]" />
					<span className="relative flex items-center gap-3 bg-[#C9A227] group-hover:bg-[#E4C874] text-[#0B1220] px-8 py-4 rounded-full font-semibold transition-colors">
						<Play className="w-4 h-4 fill-current" />
						Watch demo
					</span>
				</button>
			</section>

			{/* ---------------------------------------------------------------- */}
			{/* Pricing                                                           */}
			{/* ---------------------------------------------------------------- */}
			<section id="pricing" className="border-t border-white/6]">
				<div className="container mx-auto px-6 py-24">
					<div className="text-center max-w-xl mx-auto">
						<span className="font-(family-name:--font-mono,monospace) text-xs uppercase tracking-[0.2em] text-[#C9A227]">
							Pricing
						</span>
						<h2 className="font-[family-name:var(--font-display,serif)] text-4xl md:text-5xl mt-4">
							Priced by roll number, not by feature
						</h2>
						<p className="text-[#F3EFE3]/55 mt-4">
							Every plan includes the full platform. Pick the tier
							that matches your enrollment.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
						{PLANS.map((plan) => (
							<div
								key={plan.students}
								className={`relative rounded-2xl p-8 border transition-colors ${
									plan.featured
										? "border-[#C9A227] bg-linear-to-b from-[#C9A227]/10 to-transparent"
										: "border-white/8 bg-[#141D33] hover:border-white/20"
								}`}
							>
								{plan.featured && (
									<div className="absolute -top-3 left-8 bg-[#C9A227] text-[#0B1220] text-xs font-semibold px-3 py-1 rounded-full">
										Most schools choose this
									</div>
								)}

								<h3 className="font-medium text-[#F3EFE3]/70">
									{plan.students}
								</h3>

								<div className="mt-7 pb-5 border-b border-white/8">
									<p className="text-[#F3EFE3]/45 text-xs uppercase tracking-wide">
										Monthly
									</p>
									<p className="font-(family-name:--font-mono,monospace) text-4xl mt-1">
										{plan.monthly}
									</p>
								</div>

								<div className="mt-5">
									<p className="text-[#F3EFE3]/45 text-xs uppercase tracking-wide">
										Yearly
									</p>
									<p className="font-(family-name:--font-mono,monospace) text-2xl mt-1 text-[#F3EFE3]/80">
										{plan.yearly}
									</p>
								</div>

								<Link
									href="/auth/school/register"
									className={`block text-center mt-8 py-3 rounded-md font-medium transition-colors ${
										plan.featured
											? "bg-[#C9A227] hover:bg-[#E4C874] text-[#0B1220]"
											: "border border-white/15 hover:border-white/35 text-[#F3EFE3]/85"
									}`}
								>
									Get started
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ---------------------------------------------------------------- */}
			{/* CTA                                                               */}
			{/* ---------------------------------------------------------------- */}
			<section className="relative border-t border-white/6 bg-[#364153] py-24 text-center overflow-hidden">
				<div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,#F3EFE3_0,#F3EFE3_1px,transparent_1px,transparent_28px)]" />
				<div className="relative">
					<span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#F3EFE3]/40 text-[#F3EFE3]">
						<ShieldCheck className="w-7 h-7" />
					</span>
					<h2 className="font-(family-name:--font-display,serif) text-4xl md:text-5xl mt-6">
						Ready to get started!
					</h2>
					<p className="mt-4 text-[#F3EFE3]/75 max-w-md mx-auto">
						Set up your school's admissions, attendance, and fees in
						an afternoon.
					</p>
					<Link
						href="/auth/school/register"
						className="inline-flex items-center gap-2 mt-9 bg-[#F3EFE3] text-[#0B1220] hover:bg-white px-8 py-4 rounded-md font-semibold transition-colors"
					>
						Register your school
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</section>

			{/* ---------------------------------------------------------------- */}
			{/* Footer                                                            */}
			{/* ---------------------------------------------------------------- */}
			<footer className="bg-[#0B1220] text-[#F3EFE3]/60 py-16 border-t border-white/6">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
						{/* Brand */}
						<div className="col-span-1">
							<Link
								href="/"
								className="text-xl font-(family-name:--font-display,serif) text-[#F3EFE3] flex items-center gap-2"
							>
								<span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A227]/60 text-[#C9A227] text-sm">
									अ
								</span>
								Anant School
							</Link>
							<p className="mt-4 text-sm leading-relaxed">
								A cloud-based, multi-tenant school management
								system. Streamline admissions, automate
								attendance, and collect fees from a single
								platform.
							</p>
							<div className="flex mt-6 space-x-4">
								{[
									FiFacebook,
									FiTwitter,
									FiInstagram,
									FiLinkedin,
								].map((Icon, i) => (
									<a
										key={i}
										href="#"
										className="text-[#F3EFE3]/40 hover:text-[#C9A227] transition-colors"
									>
										<Icon className="w-5 h-5" />
									</a>
								))}
							</div>
						</div>

						{/* Product */}
						<div>
							<h3 className="text-xs font-semibold text-[#F3EFE3] uppercase tracking-wider">
								Product
							</h3>
							<ul className="mt-4 space-y-3 text-sm">
								<li>
									<Link
										href="#features"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Features & modules
									</Link>
								</li>
								<li>
									<Link
										href="#pricing"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Pricing plans
									</Link>
								</li>
								<li>
									<Link
										href="#demo"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Book a demo
									</Link>
								</li>
								<li>
									<Link
										href="/auth/login"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										School login
									</Link>
								</li>
								<li>
									<Link
										href="/auth/school/register"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Register your school
									</Link>
								</li>
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h3 className="text-xs font-semibold text-[#F3EFE3] uppercase tracking-wider">
								Legal & support
							</h3>
							<ul className="mt-4 space-y-3 text-sm">
								<li>
									<Link
										href="/term-and-conditions/term-conditions"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Terms and conditions
									</Link>
								</li>
								<li>
									<Link
										href="/term-and-conditions/privacy-policy"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Privacy policy
									</Link>
								</li>
								<li>
									<Link
										href="/term-and-conditions/refund-and-cancelation"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Refund & cancellation
									</Link>
								</li>
								<li>
									<Link
										href="/help-center"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										Help center / documentation
									</Link>
								</li>
							</ul>
						</div>

						{/* Contact */}
						<div>
							<h3 className="text-xs font-semibold text-[#F3EFE3] uppercase tracking-wider">
								Contact us
							</h3>
							<ul className="mt-4 space-y-4 text-sm">
								<li className="flex items-center">
									<Mail className="w-4 h-4 mr-3 text-[#C9A227]" />
									<a
										href="mailto:bkushwah1081@gmail.com"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										bkushwah1081@gmail.com
									</a>
								</li>
								<li className="flex items-center">
									<Phone className="w-4 h-4 mr-3 text-[#C9A227]" />
									<a
										href="tel:+919285022678"
										className="hover:text-[#F3EFE3] transition-colors"
									>
										+91 92850 22678
									</a>
								</li>
								<li className="flex items-start">
									<MapPin className="w-4 h-4 mr-3 mt-1 text-[#C9A227] shrink-0" />
									<span>
										Press Colony,
										<br />
										Anand Nagar, Bhopal, India
									</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-14 pt-8 border-t border-white/6] flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
						<p className="text-center md:text-left">
							&copy; {currentYear} Anant School (SaaS). All rights
							reserved.
						</p>
						<span className="flex items-center">
							<span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
							All systems operational
						</span>
					</div>
				</div>
			</footer>

			<style>{`
            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(14px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `}</style>
		</main>
	);
}

import Image from "next/image";
import {prisma} from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";


import {
	Home,
	Info,
	Phone,
	UserPlus,
	LogIn,
	Users,
	GraduationCap,
	CalendarCheck,
	FileText,
	Building,
	Award,
	Link2,
} from "lucide-react";

export default async function LandingPage({params}) {

	
	
	const param = await params;
    //  console.log(param.school);
	
	
	const school = await prisma.school.findUnique({
		where :{
			subdomain : param.school
		}
	})
	
	if(!school){
		return notFound();
	}


	return (
		<div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden relative">
			{/* Background Gradient/Curve effect (Simplified with CSS) */}
			<div className="absolute top-0 right-0 w-2/3 h-[80%] bg-blue-50/50 rounded-bl-[150px] -z-10 hidden lg:block" />

			{/* --- Navbar --- */}
			<nav className="flex items-center justify-between px-6 lg:px-16 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
				<div className="flex items-center gap-3">
					<div className="bg-blue-600 p-2 rounded-lg text-white">
						<GraduationCap className="w-6 h-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-blue-900 leading-none">
							{school.schoolName}
						</h1>
						<p className="text-xs text-gray-500 font-medium mt-1">
							Anant School Management System
						</p>
					</div>
				</div>

				{/* Desktop Nav Links */}
				<div className="hidden md:flex space-x-10 text-gray-600 font-medium">
					<Link
						href="#"
						className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-1"
					>
						<Home className="w-4 h-4" /> Home
					</Link>
					<Link
						href="#"
						className="flex items-center gap-2 hover:text-blue-600 transition-colors pb-1"
					>
						<Info className="w-4 h-4" /> About
					</Link>
					<Link
						href="#"
						className="flex items-center gap-2 hover:text-blue-600 transition-colors pb-1"
					>
						<Phone className="w-4 h-4" /> Contact
					</Link>
					<Link
						href="#"
						className="flex items-center gap-2 hover:text-blue-600 transition-colors pb-1"
					>
						<UserPlus className="w-4 h-4" /> Admission
					</Link>
				</div>

				<Link 
				
				href="/auth/login"
				className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
					<LogIn className="w-4 h-4"/> Login
				</Link>
			</nav>

			{/* --- Hero Section --- */}
			<main className="relative flex flex-col lg:flex-row px-6 lg:px-16 pt-16 pb-24 max-w-[1400px] mx-auto">
				{/* Left Column (Text & Features) */}
				<div className="lg:w-1/2 z-10 lg:pr-12 pt-8">
					<h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
						Smart School <br />
						Management <br />
						<span className="text-blue-600">Simplified</span>
					</h2>

					<p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-lg">
						Anant School is a complete solution to manage students,
						teachers, classes, attendance, exams, fees and more –
						all in one place.
					</p>

					{/* Feature Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-xl">
						{/* Card 1 */}
						<div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
							<div className="bg-blue-50 p-3 rounded-xl mb-3 text-blue-600">
								<Users className="w-6 h-6" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								Student
								<br />
								Management
							</span>
						</div>
						{/* Card 2 */}
						<div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
							<div className="bg-green-50 p-3 rounded-xl mb-3 text-green-500">
								<GraduationCap className="w-6 h-6" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								Teacher
								<br />
								Management
							</span>
						</div>
						{/* Card 3 */}
						<div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
							<div className="bg-yellow-50 p-3 rounded-xl mb-3 text-amber-500">
								<CalendarCheck className="w-6 h-6" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								Attendance
								<br />
								Tracking
							</span>
						</div>
						{/* Card 4 */}
						<div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
							<div className="bg-purple-50 p-3 rounded-xl mb-3 text-purple-500">
								<FileText className="w-6 h-6" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								Fee
								<br />
								Management
							</span>
						</div>
					</div>

					{/* CTA Area */}
					<div className="flex flex-col items-start gap-4">
						<Link 
						href="/auth/login"
						className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
							<LogIn className="w-5 h-5" /> Login to Your Account
						</Link>
						<div className="text-slate-500 text-sm flex gap-3 items-center font-medium">
							<span>Secure Access</span>
							<span className="w-1 h-1 bg-slate-300 rounded-full" />
							<span>Easy to Use</span>
							<span className="w-1 h-1 bg-slate-300 rounded-full" />
							<span>Anytime, Anywhere</span>
						</div>
					</div>
				</div>

				{/* Right Column (Hero Image) */}
				<div className="lg:w-1/2 relative mt-16 lg:mt-0 flex justify-end">
					<div className="relative w-full max-w-2xl aspect-[4/3] rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl border-8 border-white">
						{/* NOTE: Add your image to the public folder and update the src */}
						<Image
							src="/images/School Grid.png"
							alt="Students walking to school building"
							width={1000}
							height={200}
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</main>

			{/* --- Stats Bottom Bar --- */}
			<div className="relative z-20 max-w-6xl mx-auto px-6 pb-12">
				<div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col md:flex-row justify-between items-center gap-8 -mt-12 lg:-mt-20">
					<div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
						<div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
							<Building className="w-7 h-7" />
						</div>
						<div>
							<h4 className="text-2xl font-extrabold text-blue-900">
								500+
							</h4>
							<p className="text-slate-500 text-sm font-medium">
								Schools
							</p>
						</div>
					</div>

					<div className="hidden md:block w-px h-12 bg-gray-100" />

					<div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
						<div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
							<Users className="w-7 h-7" />
						</div>
						<div>
							<h4 className="text-2xl font-extrabold text-blue-900">
								50,000+
							</h4>
							<p className="text-slate-500 text-sm font-medium">
								Students
							</p>
						</div>
					</div>

					<div className="hidden md:block w-px h-12 bg-gray-100" />

					<div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
						<div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
							<GraduationCap className="w-7 h-7" />
						</div>
						<div>
							<h4 className="text-2xl font-extrabold text-blue-900">
								2,000+
							</h4>
							<p className="text-slate-500 text-sm font-medium">
								Teachers
							</p>
						</div>
					</div>

					<div className="hidden md:block w-px h-12 bg-gray-100" />

					<div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
						<div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
							{/* <Linkward className="w-7 h-7" /> */}
						</div>
						<div>
							<h4 className="text-2xl font-extrabold text-blue-900">
								10+
							</h4>
							<p className="text-slate-500 text-sm font-medium">
								Years of Trust
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

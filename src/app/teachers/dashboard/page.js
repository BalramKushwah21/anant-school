import React from "react";
import {
	Users,
	CalendarDays,
	ClipboardCheck,
	Bell,
	BookOpen,
	Clock,
	ChevronRight,
	FileText,
	MapPin,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
// Import your Prisma client (adjust the path to match your project structure)
import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- SERVER-SIDE DATA FETCHING ---
async function getDashboardData() {
	// In production, get the ID from the logged-in user's session:
	// const session = await getServerSession(authOptions);
	// const teacherEmail = session?.user?.email;

	// For this example, we'll assume we have a teacher ID
	const teacherId = "teacher_id_here"; // Replace with dynamic ID

	try {
		/* UNCOMMENT AND ADJUST THIS WHEN READY TO CONNECT TO YOUR DB:
      
      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
        include: {
          teacherProfile: {
            include: {
              timetable: {
                where: { dayOfWeek: new Date().getDay() },
                orderBy: { startTime: 'asc' }
              },
              assignments: {
                where: { status: 'PENDING' }
              }
            }
          }
        }
      });
      
      const notices = await prisma.notice.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      
      return { teacher, notices };
    */

		// Fallback Mock Data structured like Prisma's output for UI demonstration
		return {
			teacher: {
				name: "Arjun Sharma",
				subject: "Senior Mathematics",
				stats: {
					classesToday: 4,
					pendingGrading: 12,
					attendancePending: 2,
					totalStudents: 145,
				},
				todaysSchedule: [
					{
						id: 1,
						startTime: "08:30 AM",
						endTime: "09:15 AM",
						class: "Class 10 - A",
						subject: "Mathematics",
						room: "Room 101",
						status: "completed",
					},
					{
						id: 2,
						startTime: "09:15 AM",
						endTime: "10:00 AM",
						class: "Class 9 - B",
						subject: "Mathematics",
						room: "Room 104",
						status: "active",
					},
					{
						id: 3,
						startTime: "10:30 AM",
						endTime: "11:15 AM",
						class: "Class 12 - Sci",
						subject: "Advanced Calculus",
						room: "Lab 2",
						status: "upcoming",
					},
					{
						id: 4,
						startTime: "12:00 PM",
						endTime: "12:45 PM",
						class: "Class 11 - A",
						subject: "Algebra",
						room: "Room 203",
						status: "upcoming",
					},
				],
			},
			notices: [
				{
					id: 1,
					title: "Staff Meeting at 3 PM",
					date: "Today, 10:00 AM",
					type: "URGENT",
				},
				{
					id: 2,
					title: "Submit Mid-Term Grades",
					date: "Yesterday",
					type: "REMINDER",
				},
			],
		};
	} catch (error) {
		console.error("Dashboard Fetch Error:", error);
		return null;
	}
}

// --- MAIN PAGE COMPONENT ---
export default async function TeacherDashboard() {
	const data = await getDashboardData();

	if (!data) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<p className="text-slate-500 flex items-center gap-2">
					<AlertCircle className="w-5 h-5 text-red-500" />
					Failed to load dashboard data. Please try again later.
				</p>
			</div>
		);
	}

	const { teacher, notices } = data;

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header Section (Premium Glassmorphism feel) */}
				<header className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-sm border border-slate-100/50">
					<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>

					<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
						<div>
							<p className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-1">
								Teacher Portal
							</p>
							<h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
								Welcome back, {teacher.name.split(" ")[0]} 👋
							</h1>
							<p className="text-slate-500 mt-2 text-lg">
								Here is what's happening at School Grid today.
							</p>
						</div>

						<div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-inner">
							<div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
							<span className="text-sm font-medium text-slate-700">
								{teacher.subject}
							</span>
						</div>
					</div>
				</header>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					<StatCard
						title="Classes Today"
						value={teacher.stats.classesToday}
						icon={
							<CalendarDays className="w-6 h-6 text-indigo-600" />
						}
						gradient="from-indigo-500/10 to-indigo-500/5"
						borderColor="border-indigo-100"
					/>
					<StatCard
						title="Pending Grading"
						value={teacher.stats.pendingGrading}
						icon={<FileText className="w-6 h-6 text-amber-600" />}
						gradient="from-amber-500/10 to-amber-500/5"
						borderColor="border-amber-100"
					/>
					<StatCard
						title="Attendance Pending"
						value={teacher.stats.attendancePending}
						icon={
							<ClipboardCheck className="w-6 h-6 text-rose-600" />
						}
						gradient="from-rose-500/10 to-rose-500/5"
						borderColor="border-rose-100"
					/>
					<StatCard
						title="Total Students"
						value={teacher.stats.totalStudents}
						icon={<Users className="w-6 h-6 text-emerald-600" />}
						gradient="from-emerald-500/10 to-emerald-500/5"
						borderColor="border-emerald-100"
					/>
				</div>

				{/* Main Content Layout */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* Left Column (Spans 2) */}
					<div className="xl:col-span-2 space-y-8">
						{/* Interactive Schedule */}
						<section className="bg-white rounded-3xl shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-8">
							<div className="flex justify-between items-center mb-8">
								<div>
									<h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
										<Clock className="w-5 h-5 text-blue-500" />{" "}
										Today's Itinerary
									</h2>
									<p className="text-sm text-slate-500 mt-1">
										Your assigned periods for today.
									</p>
								</div>
								<button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
									View Weekly
								</button>
							</div>

							<div className="space-y-4">
								{teacher.todaysSchedule.map((session) => (
									<ScheduleRow
										key={session.id}
										session={session}
									/>
								))}
							</div>
						</section>

						{/* Quick Actions (Hover Interactive) */}
						<section className="bg-white rounded-3xl shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-8">
							<h2 className="text-xl font-bold text-slate-900 mb-6">
								Quick Actions
							</h2>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<ActionBtn
									icon={
										<ClipboardCheck className="w-6 h-6" />
									}
									label="Attendance"
									colorClass="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border-blue-100"
								/>
								<ActionBtn
									icon={<BookOpen className="w-6 h-6" />}
									label="Assignments"
									colorClass="text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white border-purple-100"
								/>
								<ActionBtn
									icon={<FileText className="w-6 h-6" />}
									label="Upload Marks"
									colorClass="text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-100"
								/>
								<ActionBtn
									icon={<CalendarDays className="w-6 h-6" />}
									label="Apply Leave"
									colorClass="text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white border-orange-100"
								/>
							</div>
						</section>
					</div>

					{/* Right Column */}
					<div className="space-y-8">
						{/* Notice Board */}
						<section className="bg-white rounded-3xl shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-8">
							<h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
								<Bell className="w-5 h-5 text-amber-500" />{" "}
								School Notices
							</h2>

							<div className="space-y-4">
								{notices.map((notice) => (
									<div
										key={notice.id}
										className="group relative p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-slate-50 hover:bg-white cursor-pointer overflow-hidden"
									>
										<div
											className={`absolute left-0 top-0 bottom-0 w-1 ${notice.type === "URGENT" ? "bg-red-500" : "bg-blue-500"}`}
										></div>
										<div className="flex justify-between items-start mb-2">
											<h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
												{notice.title}
											</h3>
										</div>
										<div className="flex items-center justify-between mt-3">
											<p className="text-xs font-medium text-slate-400">
												{notice.date}
											</p>
											<span
												className={`text-[10px] tracking-wider uppercase font-extrabold px-2.5 py-1 rounded-lg ${
													notice.type === "URGENT"
														? "bg-red-100 text-red-700"
														: "bg-blue-100 text-blue-700"
												}`}
											>
												{notice.type}
											</span>
										</div>
									</div>
								))}
							</div>
							<button className="w-full mt-6 py-3 text-sm font-bold text-slate-700 border-2 border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all">
								View All Announcements
							</button>
						</section>

						{/* Support Widget */}
						<section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
							<h3 className="font-bold text-xl mb-2 relative z-10">
								Need Admin Help?
							</h3>
							<p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">
								Reach out to the front desk for timetable
								adjustments or IT support.
							</p>
							<button className="relative z-10 flex items-center justify-between w-full bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all duration-300">
								<span>Message Admin</span>
								<ChevronRight className="w-4 h-4" />
							</button>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}

// --- SUB-COMPONENTS (For cleaner code) ---

function StatCard({ title, value, icon, gradient, borderColor }) {
	return (
		<div
			className={`bg-gradient-to-br ${gradient} border ${borderColor} rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white`}
		>
			<div className="flex justify-between items-start">
				<div>
					<p className="text-sm font-semibold text-slate-500 mb-1">
						{title}
					</p>
					<h3 className="text-3xl font-black text-slate-800">
						{value}
					</h3>
				</div>
				<div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100/50">
					{icon}
				</div>
			</div>
		</div>
	);
}

function ScheduleRow({ session }) {
	// Determine styling based on status
	const isComplete = session.status === "completed";
	const isActive = session.status === "active";

	return (
		<div
			className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
				isActive
					? "bg-blue-50 border-blue-200 shadow-sm"
					: "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
			}`}
		>
			{/* Time Block */}
			<div className="sm:w-1/4 flex flex-col justify-center">
				<span
					className={`text-sm font-bold ${isActive ? "text-blue-700" : "text-slate-700"}`}
				>
					{session.startTime}
				</span>
				<span className="text-xs font-medium text-slate-400">
					{session.endTime}
				</span>
			</div>

			{/* Class Info Block */}
			<div className="sm:w-2/4">
				<div className="flex items-center gap-2 mb-1">
					<p className="font-extrabold text-slate-900 text-lg">
						{session.class}
					</p>
					{isActive && (
						<span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse">
							Ongoing
						</span>
					)}
					{isComplete && (
						<CheckCircle2 className="w-4 h-4 text-emerald-500" />
					)}
				</div>
				<p className="text-sm font-medium text-slate-500">
					{session.subject}
				</p>
			</div>

			{/* Location/Action Block */}
			<div className="sm:w-1/4 flex sm:justify-end items-center">
				<div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-xl font-semibold border border-slate-200">
					<MapPin className="w-3.5 h-3.5" />
					{session.room}
				</div>
			</div>
		</div>
	);
}

function ActionBtn({ icon, label, colorClass }) {
	return (
		<button
			className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 group ${colorClass}`}
		>
			<div className="transform group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
				{icon}
			</div>
			<span className="text-sm font-bold tracking-tight">{label}</span>
		</button>
	);
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Eye, Edit, MessageSquare, Bell, Loader2 } from "lucide-react";

export default function AttendanceAnalytics() {
	// Replace dummy data with empty array and loading state
	const [students, setStudents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Filter & Search States
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("All");
	const [selectedSection, setSelectedSection] = useState("All");
	const [attendanceDate, setAttendanceDate] = useState(
		new Date().toISOString().split("T")[0],
	);

	// Sorting State (Default by Lowest Attendance Percentage)
	const [sortConfig, setSortConfig] = useState("percent-asc");

	// ================= FETCH LOGIC (Best Practice Sync) =================
	useEffect(() => {
		const fetchAnalytics = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/school/students/attendance/analytics?date=${attendanceDate}`,
				);
				if (!response.ok) throw new Error("Failed to fetch data");
				const result = await response.json();

				if (result.data) {
					setStudents(result.data);
				}
			} catch (error) {
				console.error("Fetch Error:", error);
				alert("Failed to load attendance analytics.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalytics();
	}, [attendanceDate]); // Re-fetch whenever the selected date changes

	// Administrative Action Handlers
	const handleAction = (action, studentName) => {
		alert(`${action} action triggered for ${studentName}`);
	};

	// 1. FILTERING, CALCULATING PERCENTAGE & SORTING LOGIC (Untouched)
	const processedStudents = useMemo(() => {
		// A. Filter
		let result = students.filter((student) => {
			const matchesSearch =
				student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				student.rollNo?.toString().includes(searchTerm);
			const matchesClass =
				selectedClass === "All" || student.class === selectedClass;
			const matchesSection =
				selectedSection === "All" ||
				student.section === selectedSection;
			return matchesSearch && matchesClass && matchesSection;
		});


		// C. Sort
		result.sort((a, b) => {
			if (sortConfig === "percent-asc")
				return a.percentage - b.percentage;
			if (sortConfig === "percent-desc")
				return b.percentage - a.percentage;
			if (sortConfig === "rollNo-asc")
				return parseInt(a.rollNo) - parseInt(b.rollNo);
			if (sortConfig === "name-asc") return a.name.localeCompare(b.name);
			return 0;
		});

		return result;
	}, [students, searchTerm, selectedClass, selectedSection, sortConfig]);

	// 2. DYNAMIC CALCULATIONS FOR TOP CARDS (Based on Today's Status)
	const totalStrength = processedStudents.length;
	const totalPresent = processedStudents.filter(
		(s) => s.status === "Present",
	).length;
	const totalAbsent = processedStudents.filter(
		(s) => s.status === "Absent",
	).length;
	const totalLate = processedStudents.filter(
		(s) => s.status === "Late",
	).length;

	return (
		<div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-7xl mx-auto">
				{/* Top Control Bar */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
					<div>
						<h2 className="text-2xl font-extrabold text-slate-800">
							Comprehensive Attendance Report
						</h2>
						<p className="text-sm text-slate-500 font-medium">
							Analyze aggregated attendance data and take
							administrative actions.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<input
							type="text"
							placeholder="Search Name or Roll No..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto shadow-sm"
						/>
						<input
							type="date"
							value={attendanceDate}
							onChange={(e) => setAttendanceDate(e.target.value)}
							className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700"
						/>
						{/* Same dropdowns as your original code */}
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700"
						>
							<option value="All">All Grades</option>
							<option value="Class 1st">Class 1st</option>
							<option value="Class 2nd">Class 2nd</option>
							<option value="Class 3rd">Class 3rd</option>
							<option value="Class 4th">Class 4th</option>
							<option value="Class 5th">Class 5th</option>
							<option value="Class 6th">Class 6th</option>
						</select>
						<select
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value)}
							className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700"
						>
							<option value="All">All Sections</option>
							<option value="A">Section A</option>
							<option value="B">Section B</option>
							<option value="C">Section C</option>
						</select>

						<select
							value={sortConfig}
							onChange={(e) => setSortConfig(e.target.value)}
							className="rounded-xl border-indigo-200 text-sm p-2.5 border bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-bold text-indigo-700"
						>
							<option value="percent-asc">
								Sort: Attendance % (Low to High)
							</option>
							<option value="percent-desc">
								Sort: Attendance % (High to Low)
							</option>
							<option value="rollNo-asc">
								Sort: Roll No (Asc ↑)
							</option>
							<option value="name-asc">Sort: Name (A-Z)</option>
						</select>
					</div>
				</div>

				{/* Dynamic Attendance Summary Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
							Total Strength
						</span>
						<p className="text-3xl font-extrabold text-slate-800 mt-1">
							{totalStrength}
						</p>
					</div>
					<div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center shadow-sm">
						<span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
							Today's Present
						</span>
						<p className="text-3xl font-extrabold text-emerald-800 mt-1">
							{totalPresent}
						</p>
					</div>
					<div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl text-center shadow-sm">
						<span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
							Today's Absent
						</span>
						<p className="text-3xl font-extrabold text-rose-800 mt-1">
							{totalAbsent}
						</p>
					</div>
					<div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center shadow-sm">
						<span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
							Today's Late
						</span>
						<p className="text-3xl font-extrabold text-amber-800 mt-1">
							{totalLate}
						</p>
					</div>
				</div>

				{/* Aggregate Roster Table */}
				<div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
					<table className="w-full text-left border-collapse bg-white">
						<thead>
							<tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
								<th className="p-4 pl-6 w-24">Roll No</th>
								<th className="p-4">Student Name</th>
								<th className="p-4 text-center">
									Total School Days
								</th>
								<th className="p-4 text-center text-emerald-700">
									Present Days
								</th>
								<th className="p-4 text-center text-rose-700">
									Absent Days
								</th>
								<th className="p-4 text-center">
									Attendance %
								</th>
								<th className="p-4 text-right pr-6">
									Administrative Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-sm text-slate-700">
							{isLoading ? (
								<tr>
									<td
										colSpan="7"
										className="p-10 text-center text-indigo-500 font-medium"
									>
										<div className="flex flex-col items-center justify-center gap-3">
											<Loader2
												className="animate-spin"
												size={32}
											/>
											Fetching Live Analytics from
											Database...
										</div>
									</td>
								</tr>
							) : processedStudents.length > 0 ? (
								processedStudents.map((student) => (
									<tr
										key={student.id}
										className="hover:bg-slate-50/80 transition-colors group"
									>
										<td className="p-4 pl-6 font-mono font-bold text-slate-500">
											{student.rollNo}
										</td>
										<td className="p-4">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
													{student.name.charAt(0)}
												</div>
												<div>
													<p className="font-bold text-slate-800">
														{student.name}
													</p>
													<p className="text-xs font-medium text-slate-400">
														{student.class} - Sec{" "}
														{student.section}
													</p>
												</div>
											</div>
										</td>
										<td className="p-4 text-center font-semibold text-slate-600">
											{student.totalDays}
										</td>
										<td className="p-4 text-center font-bold text-emerald-600">
											{student.presentDays}
										</td>
										<td className="p-4 text-center font-bold text-rose-600">
											{student.absentDays}
										</td>
										<td className="p-4 text-center">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${
													student.percentage >= 75
														? "bg-emerald-100 text-emerald-800"
														: student.percentage >=
															  60
															? "bg-amber-100 text-amber-800"
															: "bg-rose-100 text-rose-800"
												}`}
											>
												{student.percentage}%
											</span>
										</td>
										<td className="p-4 text-right pr-6">
											<div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
												<button
													onClick={() =>
														handleAction(
															"View Profile",
															student.name,
														)
													}
													className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg font-semibold text-xs transition-colors"
												>
													<Eye size={14} /> Profile
												</button>
												<button
													onClick={() =>
														handleAction(
															"Edit Attendance",
															student.name,
														)
													}
													className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg font-semibold text-xs transition-colors"
												>
													<Edit size={14} /> Edit
												</button>
												<button
													onClick={() =>
														handleAction(
															"Send Warning",
															student.name,
														)
													}
													className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-800 rounded-lg font-semibold text-xs transition-colors"
												>
													<MessageSquare size={14} />{" "}
													Warning
												</button>
												<button
													onClick={() =>
														handleAction(
															"Notify Parent",
															student.name,
														)
													}
													className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg font-semibold text-xs transition-colors"
												>
													<Bell size={14} /> Notify
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="7"
										className="p-10 text-center text-slate-500 text-sm font-medium"
									>
										<div className="flex flex-col items-center justify-center gap-2">
											<span className="text-4xl mb-2">
												📭
											</span>
											No students match the current
											filters or search query.
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

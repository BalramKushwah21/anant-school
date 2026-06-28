"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
	ShieldCheck,
	Printer,
	QrCode,
	Scan,
	Phone,
	User,
	GraduationCap,
	Hash,
	MapPin,
	Heart,
	AlertCircle,
	Search,
} from "lucide-react";

// ==========================================
// SUB-COMPONENT: Single ID Card Design
// ==========================================
const StudentIdCard = ({ student }) => (
	<div className="w-[240px] h-[380px] bg-gradient-to-b from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-4 shadow-xl text-white relative flex flex-col justify-between border border-slate-700 print:break-inside-avoid print:shadow-none print:border-slate-400 print:text-black">
		{/* Card Header */}
		<div className="text-center border-b border-slate-700/80 print:border-slate-300 pb-2">
			<h4 className="text-[10px] font-black tracking-widest uppercase text-teal-400 print:text-slate-800 leading-tight">
				Greenwood Int. School
			</h4>
			<p className="text-[7px] tracking-wider text-slate-400 print:text-slate-500 uppercase mt-0.5">
				Student Identity Card • 2026-27
			</p>
		</div>

		{/* Avatar */}
		<div className="mx-auto my-1.5 w-16 h-16 rounded-full border-2 border-teal-500 bg-slate-700 flex items-center justify-center font-black text-xl text-slate-300 shadow-md shrink-0 print:border-slate-400 print:bg-slate-100 print:text-slate-800">
			{student.name ? student.name.charAt(0).toUpperCase() : "S"}
		</div>

		{/* Details Data Matrix */}
		<div className="bg-slate-950/70 print:bg-transparent p-2.5 rounded-xl border border-slate-800/80 print:border-slate-300 space-y-1.5 text-[9px]">
			<DetailRow
				icon={User}
				label="Name"
				value={student.name}
				isHighlight
			/>
			<DetailRow
				icon={Heart}
				label="Father"
				value={student.fatherName || "N/A"}
			/>
			<DetailRow
				icon={GraduationCap}
				label="Class"
				value={`${student.class} - ${student.section}`}
				isMono
			/>
			<DetailRow
				icon={Hash}
				label="Roll"
				value={student.rollNumber}
				highlightValue
			/>
			<DetailRow
				icon={Phone}
				label="Phone"
				value={student.phone}
				isMono
			/>

			{/* Address Block */}
			<div className="flex flex-col gap-0.5 pt-0.5 text-left">
				<span className="text-[8px] uppercase font-bold text-slate-400 print:text-slate-500 flex items-center gap-1">
					<MapPin
						size={9}
						className="text-teal-500 print:text-slate-600"
					/>{" "}
					Address
				</span>
				<p className="text-[8px] font-medium text-slate-300 print:text-slate-700 leading-tight pl-3 line-clamp-2">
					{student.address || "Address not provided"}
				</p>
			</div>
		</div>

		{/* QR Code Section */}
		<div className="pt-2 border-t border-slate-700/60 print:border-slate-300 flex flex-col items-center justify-center text-center space-y-1 shrink-0">
			<div className="p-1 bg-white rounded-lg shadow-md inline-flex items-center justify-center print:shadow-none print:border print:border-slate-200">
				<QrCode size={32} className="text-slate-900" />
			</div>
			<div className="space-y-0.5">
				<span className="text-[7px] font-black tracking-widest text-teal-400 print:text-slate-600 uppercase flex items-center justify-center gap-1">
					<Scan size={8} /> UID: {student.id}
				</span>
			</div>
		</div>
	</div>
);

// Helper component for uniform rows
const DetailRow = ({
	icon: Icon,
	label,
	value,
	isHighlight,
	isMono,
	highlightValue,
}) => (
	<div className="flex items-center justify-between border-b border-slate-800/50 print:border-slate-200 pb-1">
		<span className="text-[8px] uppercase font-bold text-slate-400 print:text-slate-500 flex items-center gap-1 shrink-0">
			<Icon size={9} className="text-teal-500 print:text-slate-600" />{" "}
			{label}
		</span>
		<span
			className={`truncate max-w-[120px] text-right 
      ${isHighlight ? "font-extrabold text-white print:text-black tracking-wide" : "font-bold text-slate-200 print:text-slate-800"} 
      ${isMono ? "font-mono" : ""} 
      ${highlightValue ? "font-mono text-teal-400 print:text-slate-800" : ""}`}
		>
			{value}
		</span>
	</div>
);

// ==========================================
// MAIN COMPONENT: Page Layout & Data Fetching
// ==========================================
export default function GenerateIDCards() {
	const [targetClass, setTargetClass] = useState("ALL");
	const [targetSection, setTargetSection] = useState("ALL");
	const [searchQuery, setSearchQuery] = useState(""); // NEW: Search state

	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);



  const CLASSES = ["Class 1st", "Class 2nd", "Class 3rd", "Class 4th", "Class 5th", "Class 6th", "Class 7th", "Class 8th", "Class 9th", "Class 10th", "Class 11th", "Class 12th"];
  const SECTIONS = ["Section A", " Section B", "Section C", "Section D", "Section E"];


	const loadLiveRosterFromBackend = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`/api/school/students/idCard?class=${encodeURIComponent(targetClass)}&section=${encodeURIComponent(targetSection)}`,
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success && result.data) {
				setStudents(result.data);
			} else {
				setStudents([]);
				if (!result.success)
					setError(result.message || "Failed to load data.");
			}
		} catch (err) {
			console.error("Error fetching students:", err);
			setError("Unable to connect to the server. Please try again.");
			setStudents([]);
		} finally {
			setLoading(false);
		}
	}, [targetClass, targetSection]);

	useEffect(() => {
		loadLiveRosterFromBackend();
		setSearchQuery(""); // Reset search when class/section changes
	}, [loadLiveRosterFromBackend]);

	// NEW: Optimized Filtering Logic
	const filteredStudents = useMemo(() => {
		if (!searchQuery.trim()) return students;

		const query = searchQuery.toLowerCase();
		return students.filter(
			(student) =>
				student.name.toLowerCase().includes(query) ||
				student.rollNumber.toLowerCase().includes(query),
		);
	}, [students, searchQuery]);

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased print:p-0 print:bg-white">
			<div className="max-w-7xl mx-auto space-y-6 print:space-y-0">
				{/* ================= HEADER & CONTROLS ================= */}
				<div className="print:hidden space-y-6">
					<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
								<ShieldCheck size={14} /> ID Generation Module
							</div>
							<h1 className="text-2xl font-black text-slate-900 tracking-tight">
								Generate Student ID Cards
							</h1>
							<p className="text-xs text-slate-400 mt-0.5">
								Fetch class rosters and generate batch CR80
								Identity Cards.
							</p>
						</div>

						<button
							onClick={() => window.print()}
							disabled={filteredStudents.length === 0 || loading}
							className="flex items-center gap-2 bg-slate-900 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Printer size={16} />
							PRINT ID CARDS
						</button>
					</div>

					{/* FILTERS & SEARCH BAR */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
								Select Grade Class
							</label>
							<select
								value={targetClass}
								onChange={(e) => setTargetClass(e.target.value)}
								className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
							>
								{CLASSES.map((cls) => (
									<option key={cls} value={cls}>
										{cls}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
								Select Section Block
							</label>
							<select
								value={targetSection}
								onChange={(e) =>
									setTargetSection(e.target.value)
								}
								className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
							>
								{SECTIONS.map((sec) => (
									<option key={sec} value={sec}>
										{sec}
									</option>
								))}
							</select>
						</div>

						{/* NEW: Search Input */}
						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
								Search Student
							</label>
							<div className="relative">
								<Search
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
									size={16}
								/>
								<input
									type="text"
									placeholder="By Name or Roll No..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* ================= STATE HANDLING & ID CARDS GRID ================= */}
				{loading && (
					<div className="p-12 text-center text-teal-600 font-bold animate-pulse print:hidden">
						Contacting cloud servers... formatting ID cards...
					</div>
				)}

				{error && !loading && (
					<div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center justify-center gap-2 print:hidden">
						<AlertCircle size={18} /> {error}
					</div>
				)}

				{!loading && !error && filteredStudents.length === 0 && (
					<div className="p-12 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200 print:hidden">
						{searchQuery
							? `No students found matching "${searchQuery}"`
							: `No student records found for ${targetClass} - Section ${targetSection}.`}
					</div>
				)}

				{/* Use filteredStudents instead of students */}
				{!loading && filteredStudents.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center print:grid-cols-2 print:gap-4 print:place-items-start">
						{filteredStudents.map((student) => (
							<StudentIdCard key={student.id} student={student} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

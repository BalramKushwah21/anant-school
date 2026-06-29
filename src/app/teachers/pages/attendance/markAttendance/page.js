"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
	Users,
	UserCheck,
	UserX,
	Clock,
	Save,
	ShieldCheck,
	Lock,
	Unlock,
	Calendar,
	Search,
	FileText,
	CheckCircle2,
	AlertTriangle,
	Loader2,
} from "lucide-react";

// ================= STATIC CONFIGURATION =================
const CLASSES = [
	"Nursery",
	"LKG",
	"UKG",
	"Class 1",
	"Class 2",
	"Class 3",
	"Class 4",
	"Class 5",
	"Class 6",
	"Class 7",
	"Class 8",
	"Class 9",
	"Class 10",
	"Class 11",
	"Class 12",
	
];
const SECTIONS = ["Section A", "Section B", "Section C", "Section D", "Section E"];

export default function FacultyAttendanceManager() {
	// ================= STATES =================
	const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
	const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
	const [searchTerm, setSearchTerm] = useState("");
	const [attendanceDate, setAttendanceDate] = useState(
		new Date().toISOString().split("T")[0],
	);

	// Real Database States for Students & Attendance
	const [students, setStudents] = useState([]);
	const [attendance, setAttendance] = useState({});
	const [remarks, setRemarks] = useState({});
	const [isSaved, setIsSaved] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// ================= ROLLING 2-DAY EDITABLE BOUNDS =================
	const editableWindow = useMemo(() => {
		const todayStr = new Date().toISOString().split("T")[0];
		const yesterdayObj = new Date();
		yesterdayObj.setDate(yesterdayObj.getDate() - 1);
		return {
			today: todayStr,
			yesterday: yesterdayObj.toISOString().split("T")[0],
		};
	}, []);

	const isEditable = useMemo(() => {
		return (
			attendanceDate === editableWindow.today ||
			attendanceDate === editableWindow.yesterday
		);
	}, [attendanceDate, editableWindow]);

	// ================= DATABASE FETCHING LOGIC =================
	useEffect(() => {
		const fetchAttendanceData = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/school/students/attendance/mark?className=${selectedClass}&section=${selectedSection}&date=${attendanceDate}`,
				);
				const data = await response.json();

				if (data.students) {
					setStudents(data.students);

					// Attendance Mapping
					const newAttendance = {};
					const newRemarks = {};

					data.students.forEach((student) => {
						newAttendance[student.id] =
							data.attendance?.[student.id] ||
							(isEditable ? "present" : "absent");
						newRemarks[student.id] =
							data.remarks?.[student.id] || "";
					});

					setAttendance(newAttendance);
					setRemarks(newRemarks);
					setIsSaved(true);
				}
			} catch (error) {
				console.error("Failed to fetch attendance data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (selectedClass && selectedSection) {
			fetchAttendanceData();
		}
	}, [attendanceDate, selectedClass, selectedSection, isEditable]);

	// ================= DATABASE SAVING LOGIC =================
	const handleSaveToDatabase = async () => {
		if (!isEditable) return;
		setIsSaving(true);

		try {
			const response = await fetch("/api/school/students/attendance/mark", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					date: attendanceDate,
					attendanceData: attendance,
					remarksData: remarks,
				}),
			});

			if (response.ok) {
				setIsSaved(true);
			} else {
				alert("Failed to save attendance.");
			}
		} catch (error) {
			console.error("Save error:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleStatusChange = (id, newStatus) => {
		if (!isEditable) return;
		setAttendance((prev) => ({ ...prev, [id]: newStatus }));
		setIsSaved(false);
	};

	const handleRemarkChange = (id, text) => {
		if (!isEditable) return;
		setRemarks((prev) => ({ ...prev, [id]: text }));
		setIsSaved(false);
	};

	const handleMarkAllAs = (status) => {
		if (!isEditable) return;
		const updated = {};
		students.forEach((s) => {
			updated[s.id] = status;
		});
		setAttendance(updated);
		setIsSaved(false);
	};

	const stats = useMemo(() => {
		const total = students.length;
		let present = 0,
			absent = 0,
			late = 0;
		students.forEach((s) => {
			if (attendance[s.id] === "present") present++;
			if (attendance[s.id] === "absent") absent++;
			if (attendance[s.id] === "late") late++;
		});
		return { total, present, absent, late };
	}, [students, attendance]);

	const filteredStudents = useMemo(() => {
		return students.filter(
			(s) =>
				s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				s.id.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [students, searchTerm]);

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Dynamic Mode Notification Bar */}
				<div
					className={`p-4 rounded-xl border flex items-center justify-between shadow-3xs transition-all duration-300 ${
						isEditable
							? "bg-teal-50 border-teal-200 text-teal-900"
							: "bg-amber-50 border-amber-200 text-amber-900"
					}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`p-2 rounded-lg ${isEditable ? "bg-teal-600 text-white" : "bg-amber-500 text-white"}`}
						>
							{isEditable ? (
								<Unlock size={16} />
							) : (
								<Lock size={16} />
							)}
						</div>
						<div>
							<p className="text-xs font-black uppercase tracking-wider">
								{isEditable
									? "Roster Access: Write Enabled"
									: "Roster Access: Read Only Archive Mode"}
							</p>
							<p className="text-[11px] opacity-80 font-medium">
								{isEditable
									? "You can freely mark or update attendance logs for this rolling 48-hour timeline window."
									: "Viewing archived historic logs. Modification access is restricted."}
							</p>
						</div>
					</div>
				</div>

				{/* Component Header & Actions */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
							<ShieldCheck size={14} /> Faculty Attendance
							Registry
						</div>
						<h1 className="text-2xl font-black text-slate-900 tracking-tight">
							Daily Roll Call Register
						</h1>
					</div>

					<button
						disabled={!isEditable || isSaved || isSaving}
						onClick={handleSaveToDatabase}
						className={`w-full sm:w-auto font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
							isSaved
								? "bg-slate-100 text-slate-400 cursor-default shadow-none border"
								: "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100"
						}`}
					>
						{isSaving ? (
							<Loader2 className="animate-spin" size={16} />
						) : (
							<Save size={16} />
						)}
						{isSaved
							? "Saved to Database"
							: isSaving
								? "Saving..."
								: "Commit Changes"}
					</button>
				</div>

				{/* ================= SEARCH & INTERACTIVE CONTEXT FILTERS ================= */}
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
					<div>
						<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
						>
							{CLASSES.map((cls) => (
								<option key={cls} value={cls}>
									{cls}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Section
						</label>
						<select
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
						>
							{SECTIONS.map((sec) => (
								<option key={sec} value={sec}>
									{sec}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Attendance Date
						</label>
						<input
							type="date"
							value={attendanceDate}
							onChange={(e) => setAttendanceDate(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all"
						/>
					</div>
					<div>
						<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Search Student
						</label>
						<input
							type="text"
							placeholder="Name or Roll No..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all"
						/>
					</div>
				</div>

				{/* Realtime Live Register KPI Counters */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
						<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
							Total Enrolled
						</span>
						<span className="text-2xl font-black text-slate-900 font-mono">
							{stats.total}
						</span>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
						<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
							Present
						</span>
						<span className="text-xl font-black text-emerald-600 font-mono">
							{stats.present}
						</span>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
						<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
							Absent
						</span>
						<span className="text-xl font-black text-rose-600 font-mono">
							{stats.absent}
						</span>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
						<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
							Late
						</span>
						<span className="text-xl font-black text-amber-500 font-mono">
							{stats.late}
						</span>
					</div>
				</div>

				{/* Main Master Registry Spreadsheet Card */}
				<div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden">
					<div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
						<span className="text-xs font-black uppercase text-slate-500 tracking-wider">
							Class {selectedClass} — Section {selectedSection}{" "}
							Roster List
						</span>
						{isEditable && (
							<div className="flex gap-2">
								<button
									onClick={() => handleMarkAllAs("present")}
									className="bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold text-slate-600 transition shadow-3xs"
								>
									✓ Set All Present
								</button>
								<button
									onClick={() => handleMarkAllAs("absent")}
									className="bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold text-slate-600 transition shadow-3xs"
								>
									✕ Set All Absent
								</button>
							</div>
						)}
					</div>

					{isLoading ? (
						<div className="p-10 flex justify-center items-center text-slate-400 flex-col gap-3">
							<Loader2 className="animate-spin" size={32} />
							<p className="text-sm font-bold">
								Fetching Roster Database...
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
										<th className="p-4 w-20 text-center">
											Roll No
										</th>
										<th className="p-4">
											Student Identity
										</th>
										<th className="p-4 w-80 text-center">
											Status Parameters
										</th>
										<th className="p-4">Remarks</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 bg-white">
									{filteredStudents.length === 0 ? (
										<tr>
											<td
												colSpan="4"
												className="text-center p-8 text-slate-400 font-medium"
											>
												No students found in Class{" "}
												{selectedClass} Section{" "}
												{selectedSection}.
											</td>
										</tr>
									) : (
										filteredStudents.map((student) => {
											const currentStatus =
												attendance[student.id] ||
												"present";
											return (
												<tr
													key={student.id}
													className="hover:bg-slate-50/50 transition-colors"
												>
													<td className="p-4 text-center font-mono font-black text-slate-400">
														{student.rollNo}
													</td>
													<td className="p-4">
														<div className="font-bold text-slate-900">
															{student.name}
														</div>
														<div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">
															{student.id} •{" "}
															{student.gender}
														</div>
													</td>
													<td className="p-4">
														<div
															className={`flex gap-1 bg-slate-100 p-1 rounded-xl max-w-xs mx-auto ${
																!isEditable &&
																"opacity-60"
															}`}
														>
															{[
																"present",
																"absent",
																"late",
															].map((code) => {
																const isSelected =
																	currentStatus ===
																	code;
																return (
																	<button
																		key={
																			code
																		}
																		type="button"
																		disabled={
																			!isEditable
																		}
																		onClick={() =>
																			handleStatusChange(
																				student.id,
																				code,
																			)
																		}
																		className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
																			isSelected
																				? code ===
																					"present"
																					? "bg-emerald-600 text-white"
																					: code ===
																						  "absent"
																						? "bg-rose-600 text-white"
																						: "bg-amber-500 text-white"
																				: isEditable
																					? "text-slate-500 hover:bg-slate-200"
																					: "text-slate-400"
																		}`}
																	>
																		{code}
																	</button>
																);
															})}
														</div>
													</td>
													<td className="p-4">
														<input
															type="text"
															disabled={
																!isEditable
															}
															placeholder={
																isEditable
																	? "Add remarks..."
																	: "Locked"
															}
															value={
																remarks[
																	student.id
																] || ""
															}
															onChange={(e) =>
																handleRemarkChange(
																	student.id,
																	e.target
																		.value,
																)
															}
															className={`w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 outline-none font-medium ${
																isEditable
																	? "focus:bg-white focus:ring-1 focus:ring-teal-500 text-slate-800"
																	: "text-slate-400"
															}`}
														/>
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

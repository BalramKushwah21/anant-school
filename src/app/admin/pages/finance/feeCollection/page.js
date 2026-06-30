"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
	Search,
	MapPin,
	Phone,
	User,
	Download,
	Bus,
	X,
	Edit,
	Loader2,
	CheckCircle,
	AlertCircle,
	Printer,
	FileText,
	CreditCard,
	ChevronLeft,
	ChevronRight,
	Filter,
	IndianRupee,
} from "lucide-react";

// ================= CONSTANTS & STATIC DATA =================
const ROUTE_DATA = [
	{ id: "Route A", villages: ["X Village", "Y Village", "Z Sector"] },
	{ id: "Route B", villages: ["C Village", "F Village", "D Village"] },
	{ id: "Route C", villages: ["City Center", "North Avenue"] },
	{ id: "Not Assigned", villages: [] },
];

const CLASSES = [
	"All",
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

const SECTIONS = ["All", "Section A", " Section B", "Section C", " Section D"];

// ================= MAIN COMPONENT =================
export default function FeeAndTransportRegistry() {
	// ---------------- STATES ----------------
	// Data States
	const [students, setStudents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	// Toast Notification State
	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "success",
	});

	// Filter States
	const [selectedClass, setSelectedClass] = useState("All");
	const [selectedSection, setSelectedSection] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All"); // All, Clear, Due

	// Pagination States
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 10;

	// Modal & Form States
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editFormData, setEditFormData] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Tab State inside Modal
	const [activeTab, setActiveTab] = useState("overview"); // overview, fees, transport

	// ---------------- FETCH DATA (GET API) ----------------
	const fetchRecords = async () => {
		try {
			setIsLoading(true);
			setError("");
			const response = await fetch("/api/school/finance/feeCollection");

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.success) {
				setStudents(result.data || []);
			} else {
				setError(result.error || "Failed to load records from server.");
			}
		} catch (err) {
			setError(
				"Something went wrong while fetching data. Please check your connection.",
			);
			console.error("Fetch Error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Load data on initial mount
	useEffect(() => {
		fetchRecords();
	}, []);

	// Auto-hide toast after 3 seconds
	useEffect(() => {
		if (toast.show) {
			const timer = setTimeout(() => {
				setToast({ ...toast, show: false });
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [toast.show]);

	// ---------------- HELPERS ----------------
	const showToast = (message, type = "success") => {
		setToast({ show: true, message, type });
	};

	// ---------------- FILTER LOGIC ----------------
	const filteredStudents = useMemo(() => {
		if (!students || !Array.isArray(students)) return [];

		return students.filter((s) => {
			if (!s || !s.name) return false;

			const classMatch =
				selectedClass === "All" || s.class === selectedClass;
			const sectionMatch =
				selectedSection === "All" || s.section === selectedSection;

			const searchLower = (searchTerm || "").toLowerCase();
			const textMatch =
				s.name.toLowerCase().includes(searchLower) ||
				(s.rollNo &&
					s.rollNo.toString().toLowerCase().includes(searchLower)) ||
				(s.contact && s.contact.toLowerCase().includes(searchLower)) ||
				(s.parent && s.parent.toLowerCase().includes(searchLower));

			let statusMatch = true;
			if (statusFilter === "Clear") {
				statusMatch = s.dueAmount <= 0;
			} else if (statusFilter === "Due") {
				statusMatch = s.dueAmount > 0;
			}

			return classMatch && sectionMatch && textMatch && statusMatch;
		});
	}, [students, selectedClass, selectedSection, searchTerm, statusFilter]);

	// ---------------- PAGINATION LOGIC ----------------
	const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = filteredStudents.slice(
		indexOfFirstRecord,
		indexOfLastRecord,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedClass, selectedSection, searchTerm, statusFilter]);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	// ---------------- SUMMARY STATISTICS ----------------
	const stats = useMemo(() => {
		const total = filteredStudents.length;
		const totalExpected = filteredStudents.reduce(
			(acc, curr) => acc + Number(curr.totalFee || 0),
			0,
		);
		const totalCollected = filteredStudents.reduce(
			(acc, curr) => acc + Number(curr.paidAmount || 0),
			0,
		);
		const totalDue = filteredStudents.reduce(
			(acc, curr) => acc + Number(curr.dueAmount || 0),
			0,
		);

		return { total, totalExpected, totalCollected, totalDue };
	}, [filteredStudents]);

	// ---------------- EXPORT TO CSV ----------------
	const handleExportCSV = () => {
		if (filteredStudents.length === 0) {
			showToast("No records to export", "error");
			return;
		}

		const headers = [
			"Roll No",
			"Student Name",
			"Class",
			"Section",
			"Parent Name",
			"Contact",
			"Address",
			"Transport Route",
			"Total Fee",
			"Paid Amount",
			"Due Amount",
		];
		const csvRows = filteredStudents.map((s) => [
			s.rollNo,
			`"${s.name}"`,
			s.class,
			s.section,
			`"${s.parent}"`,
			s.contact,
			`"${s.address}"`,
			`"${s.route}"`,
			s.totalFee,
			s.paidAmount,
			s.dueAmount,
		]);

		const csvContent = [
			headers.join(","),
			...csvRows.map((row) => row.join(",")),
		].join("\n");
		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;",
		});
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`Fee_Registry_Report_${new Date().toISOString().slice(0, 10)}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		showToast("Report downloaded successfully");
	};

	// ---------------- SAVE CHANGES (POST API) ----------------
	const handleSaveChanges = async () => {
		try {
			setIsSubmitting(true);

			// 🌟 THE FIX: Formula -> Already Paid + Now Paid
			const nowPaidAmount = Number(editFormData.nowPaid || 0);
			const totalPaidToSend =
				Number(selectedStudent.paidAmount || 0) + nowPaidAmount;

			const payload = {
				id: selectedStudent.id,
				paidAmount: totalPaidToSend,
				route: editFormData.route,
			};

			const res = await fetch("/api/school/finance/feeCollection", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to update record");
			}

			showToast(
				`Successfully updated records for ${selectedStudent.name}`,
			);
			setSelectedStudent(null);
			setIsEditing(false);

			// Refresh data
			fetchRecords();
		} catch (error) {
			console.error("Error updating fees:", error);
			showToast(
				error.message ||
					"Fee update failed. Please check your connection.",
				"error",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// ---------------- RENDER ----------------
	return (
		<div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen w-full font-sans text-slate-900">
			{/* TOAST NOTIFICATION */}
			{toast.show && (
				<div
					className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl transform transition-all duration-300 ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}
				>
					{toast.type === "success" ? (
						<CheckCircle className="w-5 h-5" />
					) : (
						<AlertCircle className="w-5 h-5" />
					)}
					<p className="font-semibold text-sm">{toast.message}</p>
				</div>
			)}

			{/* --- HEADER SECTION --- */}
			<div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
				<div>
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
						Fee & Transport Registry
					</h1>
					<p className="text-slate-500 text-base mt-2 flex items-center gap-2">
						<CreditCard className="w-4 h-4" /> Manage student fees,
						routes, and collections securely.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<button
						onClick={fetchRecords}
						className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm font-semibold flex items-center gap-2"
					>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Refresh Data"
						)}
					</button>
					<button
						onClick={handleExportCSV}
						className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md font-semibold"
					>
						<Download className="w-4 h-4" /> Export Report
					</button>
				</div>
			</div>

			{/* --- STATISTICS CARDS --- */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
					<div className="flex items-center justify-between mb-4">
						<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
							Total Students
						</p>
						<div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
							<User className="w-5 h-5" />
						</div>
					</div>
					<h3 className="text-3xl font-black text-slate-800">
						{stats.total}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
					<div className="flex items-center justify-between mb-4">
						<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
							Expected Fee
						</p>
						<div className="p-2 bg-blue-50 rounded-lg text-blue-600">
							<IndianRupee className="w-5 h-5" />
						</div>
					</div>
					<h3 className="text-3xl font-black text-slate-800">
						₹{stats.totalExpected.toLocaleString()}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
					<div className="flex items-center justify-between mb-4">
						<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
							Collected Fee
						</p>
						<div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
							<CheckCircle className="w-5 h-5" />
						</div>
					</div>
					<h3 className="text-3xl font-black text-emerald-600">
						₹{stats.totalCollected.toLocaleString()}
					</h3>
				</div>
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
					<div className="flex items-center justify-between mb-4">
						<p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
							Pending Due
						</p>
						<div className="p-2 bg-rose-50 rounded-lg text-rose-600">
							<AlertCircle className="w-5 h-5" />
						</div>
					</div>
					<h3 className="text-3xl font-black text-rose-600">
						₹{stats.totalDue.toLocaleString()}
					</h3>
				</div>
			</div>

			{/* --- FILTER SECTION --- */}
			<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
				<div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
					<Filter className="w-5 h-5 text-indigo-600" />
					<h2>Search & Filters</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="relative">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search Name, Roll, Parent..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none shadow-sm transition-all font-medium text-slate-700"
						/>
					</div>
					<select
						value={selectedClass}
						onChange={(e) => setSelectedClass(e.target.value)}
						className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none shadow-sm cursor-pointer font-medium text-slate-700 transition-all"
					>
						<option value="All" disabled className="text-slate-400">
							Select Class
						</option>
						{CLASSES.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
					<select
						value={selectedSection}
						onChange={(e) => setSelectedSection(e.target.value)}
						className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none shadow-sm cursor-pointer font-medium text-slate-700 transition-all"
					>
						<option value="All" disabled className="text-slate-400">
							Select Section
						</option>
						{SECTIONS.map((s) => (
							<option key={s} value={s}>
								Section {s}
							</option>
						))}
					</select>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none shadow-sm cursor-pointer font-medium text-slate-700 transition-all"
					>
						<option value="All">All Status</option>
						<option value="Due">Fees Pending (Due)</option>
						<option value="Clear">Fees Clear (Paid)</option>
					</select>
				</div>
			</div>

			{/* --- MAIN TABLE SECTION --- */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[1000px]">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-bold uppercase tracking-wider">
								<th className="p-4 py-5 pl-6">Roll No</th>
								<th className="p-4 py-5">Student Info</th>
								<th className="p-4 py-5">Academic</th>
								<th className="p-4 py-5">Total Fee</th>
								<th className="p-4 py-5">Paid</th>
								<th className="p-4 py-5">Due Balance</th>
								<th className="p-4 py-5 text-center pr-6">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{isLoading ? (
								<tr>
									<td
										colSpan="7"
										className="p-12 text-center"
									>
										<Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
										<p className="mt-4 text-slate-500 font-semibold text-lg">
											Fetching registry data...
										</p>
									</td>
								</tr>
							) : error ? (
								<tr>
									<td
										colSpan="7"
										className="p-12 text-center"
									>
										<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4">
											<AlertCircle className="w-8 h-8 text-rose-500" />
										</div>
										<p className="text-slate-800 font-bold text-lg mb-2">
											Failed to load data
										</p>
										<p className="text-slate-500 font-medium">
											{error}
										</p>
										<button
											onClick={fetchRecords}
											className="mt-4 px-6 py-2 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors"
										>
											Try Again
										</button>
									</td>
								</tr>
							) : currentRecords.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="p-12 text-center"
									>
										<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
											<Search className="w-8 h-8 text-slate-400" />
										</div>
										<p className="text-slate-800 font-bold text-lg mb-1">
											No records found
										</p>
										<p className="text-slate-500 font-medium">
											Try adjusting your filters or search
											term.
										</p>
									</td>
								</tr>
							) : (
								currentRecords.map((student) => (
									<tr
										key={student.id}
										className="hover:bg-indigo-50/30 transition-colors group"
									>
										<td className="p-4 pl-6 text-slate-700 font-bold whitespace-nowrap">
											<span className="px-3 py-1 bg-slate-100 rounded-lg text-sm">
												{student.rollNo}
											</span>
										</td>
										<td className="p-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
													{student.name
														? student.name
																.charAt(0)
																.toUpperCase()
														: "S"}
												</div>
												<div>
													<p className="font-bold text-slate-900 text-base">
														{student.name}
													</p>
													<p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
														<Phone className="w-3.5 h-3.5" />{" "}
														{student.contact}
													</p>
												</div>
											</div>
										</td>
										<td className="p-4">
											<p className="text-slate-800 font-bold">
												{student.class}
											</p>
											<p className="text-slate-500 text-sm font-medium mt-1">
												{student.section}
											</p>
										</td>
										<td className="p-4 text-slate-700 font-bold whitespace-nowrap text-base">
											₹
											{Number(
												student.totalFee,
											).toLocaleString()}
										</td>
										<td className="p-4 whitespace-nowrap text-base">
											<span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50">
												₹
												{Number(
													student.paidAmount,
												).toLocaleString()}
											</span>
										</td>
										<td className="p-4 whitespace-nowrap text-base">
											{Number(student.dueAmount) > 0 ? (
												<span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-200/50">
													₹
													{Number(
														student.dueAmount,
													).toLocaleString()}
												</span>
											) : (
												<span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold border border-slate-200">
													Cleared
												</span>
											)}
										</td>
										<td className="p-4 pr-6 text-center">
											<button
												onClick={() => {
													setSelectedStudent(student);
													setEditFormData({
														route:
															student.route ||
															"Not Assigned",
														nowPaid: "", // 🌟 THE FIX 1: Blank field mapping
													});
													setIsEditing(false);
													setActiveTab("overview");
												}}
												className="px-4 py-2.5 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 mx-auto"
											>
												<Edit className="w-4 h-4" />{" "}
												Manage
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* --- PAGINATION --- */}
				{filteredStudents.length > 0 && (
					<div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
						<p className="text-sm font-medium text-slate-600">
							Showing{" "}
							<span className="font-bold text-slate-900">
								{indexOfFirstRecord + 1}
							</span>{" "}
							to{" "}
							<span className="font-bold text-slate-900">
								{Math.min(
									indexOfLastRecord,
									filteredStudents.length,
								)}
							</span>{" "}
							of{" "}
							<span className="font-bold text-slate-900">
								{filteredStudents.length}
							</span>{" "}
							records
						</p>
						<div className="flex items-center gap-2">
							<button
								onClick={handlePrevPage}
								disabled={currentPage === 1}
								className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-700 bg-transparent"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<div className="px-4 py-2 rounded-lg bg-white border border-slate-200 font-bold text-sm text-indigo-700 shadow-sm">
								Page {currentPage} of {totalPages}
							</div>
							<button
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-700 bg-transparent"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* ================= MODAL DOSSIER SECTION ================= */}
			{selectedStudent && (
				<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
					<div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
						{/* --- Modal Header --- */}
						<div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-8 relative shrink-0">
							<button
								onClick={() => setSelectedStudent(null)}
								className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-colors backdrop-blur-md"
							>
								<X className="w-5 h-5" />
							</button>
							<div className="flex items-center gap-5">
								<div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30 shrink-0 shadow-inner">
									<User className="w-10 h-10 text-white drop-shadow-md" />
								</div>
								<div>
									<div className="flex items-center gap-3 mb-1">
										<span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm">
											Roll: {selectedStudent.rollNo}
										</span>
										<span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm">
											{selectedStudent.class} -{" "}
											{selectedStudent.section}
										</span>
									</div>
									<h2 className="text-3xl font-black text-white leading-tight drop-shadow-sm">
										{selectedStudent.name}
									</h2>
								</div>
							</div>
						</div>

						{/* --- Modal Navigation Tabs --- */}
						{!isEditing && (
							<div className="flex border-b border-slate-200 bg-slate-50 shrink-0 px-6 pt-2">
								<button
									onClick={() => setActiveTab("overview")}
									className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === "overview" ? "border-indigo-600 text-indigo-700 bg-white rounded-t-xl" : "border-transparent text-slate-500 hover:text-slate-800"}`}
								>
									Overview
								</button>
								<button
									onClick={() => setActiveTab("fees")}
									className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === "fees" ? "border-indigo-600 text-indigo-700 bg-white rounded-t-xl" : "border-transparent text-slate-500 hover:text-slate-800"}`}
								>
									Fee History
								</button>
								<button
									onClick={() => setActiveTab("transport")}
									className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === "transport" ? "border-indigo-600 text-indigo-700 bg-white rounded-t-xl" : "border-transparent text-slate-500 hover:text-slate-800"}`}
								>
									Transport
								</button>
							</div>
						)}

						{/* --- Modal Body --- */}
						<div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
							{!isEditing ? (
								/* VIEW MODE TAB CONTENT */
								<>
									{activeTab === "overview" && (
										<div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
											{/* Parents & Address */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
													<div className="flex items-center gap-2 mb-3 text-slate-800">
														<User className="w-4 h-4 text-indigo-500" />
														<h3 className="font-bold">
															Guardian Details
														</h3>
													</div>
													<div className="space-y-2">
														<div>
															<p className="text-xs font-semibold text-slate-400 uppercase">
																Parent Name
															</p>
															<p className="font-bold text-slate-700">
																{
																	selectedStudent.parent
																}
															</p>
														</div>
														<div>
															<p className="text-xs font-semibold text-slate-400 uppercase">
																Contact Number
															</p>
															<p className="font-bold text-slate-700 flex items-center gap-1.5">
																<Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
																{
																	selectedStudent.contact
																}
															</p>
														</div>
													</div>
												</div>

												<div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
													<div className="flex items-center gap-2 mb-3 text-slate-800">
														<MapPin className="w-4 h-4 text-emerald-500" />
														<h3 className="font-bold">
															Location Details
														</h3>
													</div>
													<div className="space-y-2">
														<div>
															<p className="text-xs font-semibold text-slate-400 uppercase">
																Residential
																Address
															</p>
															<p className="font-bold text-slate-700 leading-relaxed">
																{
																	selectedStudent.address
																}
															</p>
														</div>
														<div>
															<p className="text-xs font-semibold text-slate-400 uppercase">
																Village / Area
															</p>
															<p className="font-bold text-slate-700">
																{
																	selectedStudent.village
																}
															</p>
														</div>
													</div>
												</div>
											</div>

											{/* Financial Highlight */}
											<div
												className={`p-6 rounded-2xl border ${selectedStudent.dueAmount > 0 ? "bg-rose-50/50 border-rose-100" : "bg-emerald-50/50 border-emerald-100"}`}
											>
												<div className="flex items-center justify-between mb-4">
													<h3 className="font-bold text-slate-800 flex items-center gap-2">
														<CreditCard className="w-5 h-5 text-slate-500" />{" "}
														Account Status
													</h3>
													{selectedStudent.dueAmount >
													0 ? (
														<span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-black uppercase tracking-wider">
															Payment Pending
														</span>
													) : (
														<span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wider">
															Fully Cleared
														</span>
													)}
												</div>
												<div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200/60">
													<div>
														<p className="text-xs font-bold text-slate-500 uppercase mb-1">
															Total Fee
														</p>
														<p className="text-xl font-black text-slate-800">
															₹
															{selectedStudent.totalFee.toLocaleString()}
														</p>
													</div>
													<div>
														<p className="text-xs font-bold text-emerald-600 uppercase mb-1">
															Total Paid
														</p>
														<p className="text-xl font-black text-emerald-600">
															₹
															{selectedStudent.paidAmount.toLocaleString()}
														</p>
													</div>
													<div>
														<p className="text-xs font-bold text-rose-600 uppercase mb-1">
															Due Amount
														</p>
														<p className="text-xl font-black text-rose-600">
															₹
															{selectedStudent.dueAmount.toLocaleString()}
														</p>
													</div>
												</div>
											</div>
										</div>
									)}

									{activeTab === "fees" && (
										<div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
											<div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
												<div className="flex items-center justify-between mb-6">
													<h3 className="font-bold text-slate-800 text-lg">
														Fee Summary
													</h3>
													<button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
														<Printer className="w-4 h-4" />{" "}
														Print Receipt
													</button>
												</div>

												<div className="space-y-4">
													<div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
														<div className="flex items-center gap-3">
															<div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
																<FileText className="w-5 h-5" />
															</div>
															<div>
																<p className="font-bold text-slate-800">
																	Base Tuition
																	Fee
																</p>
																<p className="text-xs font-medium text-slate-500">
																	Academic
																	Year
																</p>
															</div>
														</div>
														<p className="font-black text-slate-800">
															₹
															{selectedStudent.totalFee.toLocaleString()}
														</p>
													</div>

													<div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
														<div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
														<div className="flex items-center gap-3 pl-2">
															<div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
																<CheckCircle className="w-5 h-5" />
															</div>
															<div>
																<p className="font-bold text-emerald-700">
																	Total Amount
																	Deposited
																</p>
																<p className="text-xs font-medium text-slate-500">
																	All
																	installments
																</p>
															</div>
														</div>
														<p className="font-black text-emerald-600">
															- ₹
															{selectedStudent.paidAmount.toLocaleString()}
														</p>
													</div>

													<div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl border border-rose-200 mt-2">
														<p className="font-black text-rose-700 uppercase tracking-wide">
															Current Outstanding
															Due
														</p>
														<p className="font-black text-rose-700 text-xl">
															₹
															{selectedStudent.dueAmount.toLocaleString()}
														</p>
													</div>
												</div>
											</div>
										</div>
									)}

									{activeTab === "transport" && (
										<div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
											<div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
												<div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
													<Bus className="w-10 h-10" />
												</div>
												<h3 className="font-black text-2xl text-slate-800 mb-1">
													{selectedStudent.route}
												</h3>
												<p className="text-slate-500 font-medium mb-6">
													Current Assigned Transport
													Route
												</p>

												<div className="w-full text-left bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
													<p className="text-xs font-bold text-slate-400 uppercase mb-3">
														Route Details
													</p>
													{selectedStudent.route ===
													"Not Assigned" ? (
														<p className="font-medium text-slate-600 flex items-center gap-2">
															<AlertCircle className="w-4 h-4 text-amber-500" />{" "}
															No transport
															facility opted.
														</p>
													) : (
														<div className="flex items-center gap-3">
															<MapPin className="w-5 h-5 text-indigo-500" />
															<p className="font-bold text-slate-700">
																Villages
																Covered:{" "}
																<span className="font-medium text-slate-600">
																	{ROUTE_DATA.find(
																		(r) =>
																			r.id ===
																			selectedStudent.route,
																	)?.villages.join(
																		", ",
																	) ||
																		"Details not found"}
																</span>
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									)}
								</>
							) : (
								/* ---------------- EDIT / COLLECT FEE MODE ---------------- */
								<div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
									<div className="pb-4 border-b border-slate-200">
										<h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
											<Edit className="w-6 h-6 text-indigo-600" />{" "}
											Manage Collection & Transport
										</h3>
										<p className="text-slate-500 font-medium mt-1">
											Update route allocation and record
											new fee deposits.
										</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										{/* Edit Form Actions */}
										<div className="space-y-6">
											{/* Edit Transport */}
											<div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
												<label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
													<Bus className="w-4 h-4 text-indigo-600" />{" "}
													Assign Transport Route
												</label>
												<select
													value={editFormData.route}
													onChange={(e) =>
														setEditFormData({
															...editFormData,
															route: e.target
																.value,
														})
													}
													className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 cursor-pointer shadow-sm"
												>
													{ROUTE_DATA.map((route) => (
														<option
															key={route.id}
															value={route.id}
														>
															{route.id}
														</option>
													))}
												</select>
												<p className="text-xs font-medium text-slate-500 mt-2 ml-1">
													Route fee logic updates
													automatically upon save.
												</p>
											</div>

											{/* Edit Fees (Now Paid) */}
											<div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
												<label className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-3">
													<CreditCard className="w-4 h-4 text-indigo-600" />{" "}
													Fee Collected Today
												</label>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
														<span className="text-indigo-600 font-black text-lg">
															₹
														</span>
													</div>
													<input
														type="number"
														min="0"
														placeholder="Enter amount (e.g. 5000)"
														value={
															editFormData.nowPaid
														} // 🌟 THE FIX 1: Linked to the empty state initially
														onChange={(e) =>
															setEditFormData({
																...editFormData,
																nowPaid:
																	e.target
																		.value,
															})
														}
														className="w-full pl-10 pr-4 py-3.5 bg-white border border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-black text-indigo-900 text-lg placeholder:text-slate-300 placeholder:font-normal shadow-sm"
													/>
												</div>
												<p className="text-xs font-medium text-indigo-600/70 mt-2 ml-1">
													Enter the exact amount
													collected right now. Do not
													include past payments.
												</p>
											</div>
										</div>

										{/* Real-time Calculation Display 🌟 THE FIX 2 applied here */}
										<div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
											{/* Decorative circles */}
											<div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl"></div>
											<div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-violet-600/20 rounded-full blur-2xl"></div>

											<h4 className="text-indigo-200 font-bold tracking-widest uppercase text-xs mb-6 relative z-10">
												Live Calculation
											</h4>

											<div className="space-y-4 relative z-10">
												<div className="flex justify-between items-center text-slate-300">
													<span className="font-medium">
														Total Expected Fee
													</span>
													<span className="font-bold text-white">
														₹
														{selectedStudent.totalFee.toLocaleString()}
													</span>
												</div>
												<div className="flex justify-between items-center text-slate-300">
													<span className="font-medium">
														Previously Paid
													</span>
													<span className="font-bold text-emerald-400">
														₹
														{selectedStudent.paidAmount.toLocaleString()}
													</span>
												</div>

												<div className="w-full h-px bg-slate-700 my-2"></div>

												<div className="flex justify-between items-center bg-indigo-900/50 p-3 rounded-xl border border-indigo-500/30">
													<span className="font-bold text-indigo-300">
														Paying Now (+)
													</span>
													<span className="font-black text-indigo-300 text-lg">
														₹
														{Number(
															editFormData.nowPaid ||
																0,
														).toLocaleString()}
													</span>
												</div>

												<div className="w-full h-px bg-slate-700 my-2"></div>

												<div className="flex justify-between items-center pt-2">
													<span className="text-slate-100 font-bold text-lg">
														New Due Balance
													</span>
													<div className="bg-rose-500/20 px-4 py-2 rounded-xl border border-rose-500/50 shadow-inner">
														<span className="text-rose-400 font-black text-2xl">
															{/* 🌟 THE FIX 2: Live calculation formula */}
															₹
															{(
																selectedStudent.totalFee -
																(selectedStudent.paidAmount +
																	Number(
																		editFormData.nowPaid ||
																			0,
																	))
															).toLocaleString()}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* --- Modal Footer (Actions) --- */}
						<div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 rounded-b-[2rem]">
							{!isEditing ? (
								<>
									<button
										onClick={() => setSelectedStudent(null)}
										className="px-6 py-3 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-all"
									>
										Close Panel
									</button>
									<button
										onClick={() => setIsEditing(true)}
										className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-bold rounded-xl transition-all flex items-center gap-2"
									>
										<Edit className="w-4 h-4" /> Edit /
										Collect Fee
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => {
											setIsEditing(false);
											setEditFormData({
												route: selectedStudent.route,
												nowPaid: "",
											});
										}}
										className="px-6 py-3 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-all"
										disabled={isSubmitting}
									>
										Cancel
									</button>
									<button
										onClick={handleSaveChanges} // 🌟 THE FIX 3: Backend payload addition
										disabled={isSubmitting}
										className="px-8 py-3 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-black rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<>
												{" "}
												<Loader2 className="w-5 h-5 animate-spin" />{" "}
												Saving...{" "}
											</>
										) : (
											<>
												{" "}
												<CheckCircle className="w-5 h-5" />{" "}
												Confirm & Save Transaction
											</>
										)}
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

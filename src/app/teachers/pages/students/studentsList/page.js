"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function TeacherStudentDirectory() {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Exact Filter states matched with Admin page
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("All");
	const [selectedSection, setSelectedSection] = useState("All");
	const [routeFilter, setRouteFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All");

	// Modal & Tab control states (No isEditing or isSaving)
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [activeTab, setActiveTab] = useState("studentInfo");
	const [formData, setFormData] = useState({});

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
	const SECTIONS = [
		"All",
		"Section A",
		"Section B",
		"Section C",
		"Section D",
		"Section E",
	];

	// Fetch master table list (Same working endpoint as Admin)
	const fetchStudents = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/school/students/get");
			if (!response.ok) throw new Error("Failed to fetch records.");
			const result = await response.json();
			setStudents(result.data || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	// Load full dataset for the student on view click
	const handleViewClick = async (studentId) => {
		setIsModalOpen(true);
		setLoadingDetails(true);
		setActiveTab("studentInfo");

		try {
			// Using the exact working API route from Admin code
			const response = await fetch(`/api/school/students/${studentId}`);
			if (!response.ok) throw new Error("Failed to get admission dossier.");
			const result = await response.json();
			const std = result.data;
			setSelectedStudent(std);

			// Safely extracting arrays just like Admin code
			const academic = std.academicProfiles?.[0] || {};

			// Map values securely. REMOVED ALL FINANCIAL AND INCOME FIELDS
			setFormData({
				admissionDate: std.admissionDate ? new Date(std.admissionDate).toISOString().split("T")[0] : "N/A",
				rollNumber: std.rollNumber || "N/A",
				firstName: std.firstName || "N/A",
				lastName: std.lastName || "N/A",
				gender: std.gender || "N/A",
				dob: std.dateOfBirth ? new Date(std.dateOfBirth).toISOString().split("T")[0] : "N/A",
				bloodGroup: std.bloodGroup || "N/A",
				category: std.category || "N/A",
				religion: std.religion || "N/A",
				nationality: std.nationality || "Indian",
				isStaffChild: std.isStaffChild ? "Yes" : "No",
				identificationMark: std.identificationMark || "None",
				aadhar: std.aadharNumber || "N/A",
				abcId: std.abcId || "N/A",

				classApplyingFor: academic.currentClass || "N/A",
				section: academic.section || "Not Assigned",
				previousSchool: academic.previousSchool || "N/A",
				previousClass: academic.previousClass || "N/A",
				tcNumber: academic.tcNumber || "N/A",
				previousUdiseCode: academic.previousUdiseCode || "N/A",
				academicSession: academic.academicSession || "N/A",
				previousMediumOfInstruction: academic.previousSchoolMedium || "English",
				boardRegistrationNumber: academic.boardRegistrationNo || "N/A",

				parentsMaritalStatus: std.family?.parentsMaritalStatus || "Married",
				legalCustodyHolder: std.family?.legalCustodyHolder || "Both",
				fatherName: std.family?.fatherName || "N/A",
				fatherMobile: std.family?.fatherMobile || "N/A",
				fatherOccupation: std.family?.fatherOccupation || "N/A",
				fatherEmail: std.family?.fatherEmail || "N/A",
				motherName: std.family?.motherName || "N/A",
				motherMobile: std.family?.motherMobile || "N/A",
				motherOccupation: std.family?.motherOccupation || "N/A",
				motherEmail: std.family?.motherEmail || "N/A",
				siblingStudyingHere: std.family?.siblingStudyingHere ? "Yes" : "No",
				siblingDetails: std.family?.siblingDetails || "None",

				houseNo: std.family?.address?.houseNo || "",
				street: std.family?.address?.street || "",
				city: std.family?.address?.city || "",
				district: std.family?.address?.district || "",
				state: std.family?.address?.state || "",
				pincode: std.family?.address?.pincode || "",

				emergencyContact: std.medicalProfile?.emergencyContactName || "N/A",
				emergencyMobile: std.medicalProfile?.emergencyContactNumber || "N/A",
				emergencyRelation: std.medicalProfile?.relationWithStudent || "N/A",
				familyDoctorName: std.medicalProfile?.familyDoctorName || "N/A",
				familyDoctorMobile: std.medicalProfile?.familyDoctorContactNumber || "N/A",
				preferredHospital: std.medicalProfile?.preferredHospital || "N/A",
				medicalConditions: std.medicalProfile?.medicalConditions || "None",
				allergies: std.medicalProfile?.allergies || "None",

				needTransport: std.transportProfile?.needTransport ? "Yes" : "No",
				pickupPoint: std.transportProfile?.pickupPoint || "N/A",
				route: std.transportProfile?.route || "Self / Private",
			});
		} catch (err) {
			alert(err.message);
			setIsModalOpen(false);
		} finally {
			setLoadingDetails(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setTimeout(() => setSelectedStudent(null), 300);
	};

	// Exact working filter logic from your Admin code
	const filteredStudents = useMemo(() => {
		return students.filter((student) => {
			const safeName = student?.name || "";
			const safeRoll = student?.rollNumber || "";

			const matchesSearch =
				safeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				safeRoll.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesClass =
				selectedClass === "All" || student.class === selectedClass;

			const matchesSection =
				selectedSection === "All" || student.section === selectedSection;

			const matchesRoute =
				routeFilter === "All" ||
				(routeFilter === "Transport" && student.route !== "Self / Private") ||
				(routeFilter === "Self" && student.route === "Self / Private");

			const matchesStatus =
				statusFilter === "All" || student.status === statusFilter;

			return (
				matchesSearch &&
				matchesClass &&
				matchesSection &&
				matchesRoute &&
				matchesStatus
			);
		});
	}, [students, searchTerm, selectedClass, selectedSection, routeFilter, statusFilter]);

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-8 animate-in fade-in duration-500 relative">
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
					<div>
						<h2 className="text-2xl font-bold text-slate-800 tracking-tight">
							Student Directory (Teacher View)
						</h2>
						<p className="text-sm text-slate-500 mt-1">
							View student academic, medical, and contact information safely.
						</p>
					</div>
				</div>

				{/* Filters Utility Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
					<div>
						<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Search Records
						</label>
						<input
							type="text"
							placeholder="Name or Roll No..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 bg-white outline-none"
						/>
					</div>
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
							Route Status
						</label>
						<select
							value={routeFilter}
							onChange={(e) => setRouteFilter(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 bg-white outline-none"
						>
							<option value="All">All Routes</option>
							<option value="Transport">School Bus</option>
							<option value="Self">Self / Private</option>
						</select>
					</div>
				</div>

				{/* Table Layout */}
				<div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
								<th className="p-4">Roll Number</th>
								<th className="p-4">Student Name</th>
								<th className="p-4">Class</th>
								<th className="p-4">Section</th>
								<th className="p-4">Parent Phone</th>
								<th className="p-4 text-center">Attendance</th>
								<th className="p-4 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
							{loading ? (
								<tr>
									<td colSpan="7" className="p-12 text-center text-slate-400 animate-pulse">
										Syncing student database...
									</td>
								</tr>
							) : filteredStudents.length > 0 ? (
								filteredStudents.map((student) => (
									<tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
										<td className="p-4 font-mono font-bold text-slate-700">
											{student.rollNumber}
										</td>
										<td className="p-4 font-semibold text-slate-800">
											{student?.name}
										</td>
										<td className="p-4 font-medium text-slate-600">
											{student.class}
										</td>
										<td className="p-4 font-medium text-slate-600">
											{student.section}
										</td>
										<td className="p-4 text-slate-600">
											{student.phone}
										</td>
										<td className="p-4 text-center">
											<span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold">
												{student.attendance}%
											</span>
										</td>
										<td className="p-4 text-center">
											<button
												onClick={() => handleViewClick(student.id)}
												className="text-xs font-bold text-teal-700 hover:text-white border border-teal-100 bg-teal-50 hover:bg-teal-600 rounded-lg px-3 py-1.5 transition-all"
											>
												View Details
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="7" className="p-12 text-center text-slate-500 font-medium">
										No matching student rows found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* --- COMPREHENSIVE READ-ONLY MODAL --- */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
						
						{/* Modal Top Header */}
						<div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
							<div>
								<h3 className="font-bold text-xl text-slate-800">
									👁️ Student Dossier (Read Only)
								</h3>
								<p className="text-xs text-slate-400 mt-0.5">
									Roll Number: <span className="font-mono text-slate-700 font-bold">{formData.rollNumber}</span>
								</p>
							</div>
							<button
								onClick={handleCloseModal}
								className="text-slate-400 hover:text-rose-500 transition-colors bg-white border p-1.5 rounded-full"
							>
								✕
							</button>
						</div>

						{/* Navigation Tabs Bar - Removed Financials completely, Kept Transport */}
						<div className="flex border-b border-slate-100 bg-slate-50/50 px-5 gap-2 overflow-x-auto text-xs font-bold uppercase tracking-wider text-slate-500">
							{[
								{ id: "studentInfo", label: "Student Details" },
								{ id: "academic", label: "Academic Info" },
								{ id: "family", label: "Parent Details" },
								{ id: "address", label: "Address & Medical" },
								{ id: "transport", label: "Transport Info" },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-3.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-teal-600 text-teal-700" : "border-transparent hover:text-slate-700"}`}
								>
									{tab.label}
								</button>
							))}
						</div>

						{/* Dynamic Content Layout - Fully Read-Only (p tags instead of inputs) */}
						<div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
							{loadingDetails ? (
								<div className="flex justify-center items-center h-40">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
									
									{/* TAB 1: Student Core Info */}
									{activeTab === "studentInfo" && (
										<>
											{[
												{ label: "Admission Date", value: formData.admissionDate },
												{ label: "Roll Number", value: formData.rollNumber },
												{ label: "First Name", value: formData.firstName },
												{ label: "Last Name", value: formData.lastName },
												{ label: "Gender", value: formData.gender },
												{ label: "Date of Birth", value: formData.dob },
												{ label: "Blood Group", value: formData.bloodGroup },
												{ label: "Category", value: formData.category },
												{ label: "Religion", value: formData.religion },
												{ label: "Nationality", value: formData.nationality },
												{ label: "Aadhar Card", value: formData.aadhar },
												{ label: "ABC ID", value: formData.abcId },
												{ label: "Staff Child?", value: formData.isStaffChild },
												{ label: "Identification Mark", value: formData.identificationMark },
											].map((item, idx) => (
												<div key={idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
													<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">{item.label}</label>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}
										</>
									)}

									{/* TAB 2: Academic Info */}
									{activeTab === "academic" && (
										<>
											{[
												{ label: "Class Assigned", value: formData.classApplyingFor },
												{ label: "Section", value: formData.section },
												{ label: "Academic Session", value: formData.academicSession },
												{ label: "Medium of Instruction", value: formData.previousMediumOfInstruction },
												{ label: "Board Registration No", value: formData.boardRegistrationNumber },
											].map((item, idx) => (
												<div key={idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
													<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">{item.label}</label>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}
										</>
									)}

									{/* TAB 3: Parent Context Details (No Income details) */}
									{activeTab === "family" && (
										<>
											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2">
												Guardian Details
											</div>
											
											

											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2 mt-2">
												Father Profiles
											</div>
											{[
												{ label: "Father's Full Name", value: formData.fatherName },
												{ label: "Father's Mobile No", value: formData.fatherMobile },
												{ label: "Father's Occupation", value: formData.fatherOccupation },
												{ label: "Father's Email ID", value: formData.fatherEmail },
											].map((item, idx) => (
												<div key={idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
													<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">{item.label}</label>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}

											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2 mt-2">
												Mother Profiles
											</div>
											{[
												{ label: "Mother's Full Name", value: formData.motherName },
												{ label: "Mother's Mobile No", value: formData.motherMobile },
												{ label: "Mother's Occupation", value: formData.motherOccupation },
												{ label: "Mother's Email ID", value: formData.motherEmail },
											].map((item, idx) => (
												<div key={idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
													<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">{item.label}</label>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}

											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2 mt-2">
												Siblings Tracker
											</div>
											<div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Sibling Studying Here?</label>
												<p className="text-sm font-semibold text-slate-800">{formData.siblingStudyingHere}</p>
											</div>
											<div className="sm:col-span-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Sibling Details</label>
												<p className="text-sm font-semibold text-slate-800">{formData.siblingDetails}</p>
											</div>
										</>
									)}

									{/* TAB 4: Address & Medical Fields */}
									{activeTab === "address" && (
										<>
											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2">
												Residential Address Info
											</div>
											<div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">House / Flat No</label>
												<p className="text-sm font-semibold text-slate-800">{formData.houseNo || "N/A"}</p>
											</div>
											<div className="sm:col-span-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Street / Locality</label>
												<p className="text-sm font-semibold text-slate-800">{formData.street || "N/A"}</p>
											</div>
											{[
												{ label: "City / Town", value: formData.city },
												{ label: "District", value: formData.district },
												{ label: "State", value: formData.state },
												{ label: "Pincode", value: formData.pincode },
											].map((item, idx) => (
												<div key={idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
													<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">{item.label}</label>
													<p className="text-sm font-semibold text-slate-800">{item.value || "N/A"}</p>
												</div>
											))}

											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2 mt-2">
												Emergency & Medical Profile
											</div>
											{[
												{ label: "Emergency Contact Person", value: formData.emergencyContact },
												{ label: "Emergency Mobile No", value: formData.emergencyMobile },
												{ label: "Relation with Student", value: formData.emergencyRelation },
												{ label: "Family Doctor Name", value: formData.familyDoctorName },
												{ label: "Doctor Mobile No", value: formData.familyDoctorMobile },
												{ label: "Preferred Hospital", value: formData.preferredHospital },
											].map((item, idx) => (
												<div key={idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
													<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">{item.label}</label>
													<p className="text-sm font-semibold text-slate-800">{item.value}</p>
												</div>
											))}
											<div className="sm:col-span-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Medical Conditions</label>
												<p className="text-sm font-semibold text-slate-800">{formData.medicalConditions}</p>
											</div>
											<div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Known Allergies</label>
												<p className="text-sm font-semibold text-slate-800">{formData.allergies}</p>
											</div>
										</>
									)}

									{/* TAB 5: Only Transport Info (Replaced Financial Tab) */}
									{activeTab === "transport" && (
										<>
											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide border-b pb-2">
												School Bus Transport Setup
											</div>
											<div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Requires Transport?</label>
												<p className="text-sm font-semibold text-slate-800">{formData.needTransport}</p>
											</div>
											<div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Pickup Point Station</label>
												<p className="text-sm font-semibold text-slate-800">{formData.pickupPoint}</p>
											</div>
											<div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
												<label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Allocated Route Code</label>
												<p className="text-sm font-semibold text-slate-800">{formData.route}</p>
											</div>
										</>
									)}
								</div>
							)}
						</div>

						{/* Modal Action Controls Footer */}
						<div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-teal-500"></span> Read-Only View
							</span>
							<button
								onClick={handleCloseModal}
								className="px-6 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-md"
							>
								Close Dossier
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
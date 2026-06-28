"use client";

import React, { useState, useEffect } from "react";

export default function StudentList() {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Filter states
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("All");
	const [selectedSection, setSelectedSection] = useState("All");
	const [routeFilter, setRouteFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("All");

	// Modal & Tab control states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("studentInfo");
	const [formData, setFormData] = useState({});

	// Fetch master table list
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
		setIsEditing(false);
		setActiveTab("studentInfo");

		try {
			const response = await fetch(
				`/api/school/students/${studentId}`,
			);
			if (!response.ok)
				throw new Error("Failed to get admission dossier.");
			const result = await response.json();
			const std = result.data;
			setSelectedStudent(std);

			// Map exact values matching the original page.js initial state
			setFormData({
				admissionDate: std.admissionDate
					? new Date(std.admissionDate).toISOString().split("T")[0]
					: "",
				rollNumber: std.rollNumber || "",
				firstName: std.firstName || "",
				lastName: std.lastName || "",
				gender: std.gender || "",
				dob: std.dateOfBirth
					? new Date(std.dateOfBirth).toISOString().split("T")[0]
					: "",
				bloodGroup: std.bloodGroup || "",
				category: std.category || "",
				religion: std.religion || "",
				nationality: std.nationality || "Indian",
				isStaffChild: std.isStaffChild ? "Yes" : "No",
				identificationMark: std.identificationMark || "",
				aadhar: std.nationalIdNumber || "",
				abcId: std.abcId || "",
				panNumber: std.panNumber || "",

				classApplyingFor: std.academicProfile?.currentClass || "",
				section: std.academicProfile?.section || "",
				previousSchool: std.academicProfile?.previousSchool || "",
				previousClass: std.academicProfile?.previousClass || "",
				tcNumber: std.academicProfile?.tcNumber || "",
				previousUdiseCode: std.academicProfile?.previousUdiseCode || "",
				academicSession: std.academicProfile?.academicSession || "",
				previousMediumOfInstruction:
					std.academicProfile?.previousSchoolMedium || "English",
				boardRegistrationNumber:
					std.academicProfile?.boardRegistrationNo || "",

				parentsMaritalStatus:
					std.family?.parentsMaritalStatus || "Married",
				legalCustodyHolder: std.family?.legalCustodyHolder || "Both",
				fatherName: std.family?.fatherName || "",
				fatherMobile: std.family?.fatherMobile || "",
				fatherOccupation: std.family?.fatherOccupation || "",
				fatherIncome: std.family?.fatherIncome || "",
				fatherEmail: std.family?.fatherEmail || "",
				motherName: std.family?.motherName || "",
				motherMobile: std.family?.motherMobile || "",
				motherOccupation: std.family?.motherOccupation || "",
				motherEmail: std.family?.motherEmail || "",
				siblingStudyingHere: std.family?.siblingStudyingHere
					? "Yes"
					: "No",
				siblingDetails: std.family?.siblingDetails || "",

				houseNo: std.family?.address?.houseNo || "",
				street: std.family?.address?.street || "",
				city: std.family?.address?.city || "",
				district: std.family?.address?.district || "",
				state: std.family?.address?.state || "",
				pincode: std.family?.address?.pincode || "",

				emergencyContact:
					std.medicalProfile?.emergencyContactName || "",
				emergencyMobile:
					std.medicalProfile?.emergencyContactNumber || "",
				emergencyRelation:
					std.medicalProfile?.relationWithStudent || "",
				familyDoctorName: std.medicalProfile?.familyDoctorName || "",
				familyDoctorMobile:
					std.medicalProfile?.familyDoctorContactNumber || "",
				preferredHospital: std.medicalProfile?.preferredHospital || "",
				medicalConditions: std.medicalProfile?.medicalConditions || "",
				allergies: std.medicalProfile?.allergies || "",

				feeCategory: std.feeRecord?.feeCategory || "GENERAL",
				scholarship: std.feeRecord?.scholarship ? "Yes" : "No",
				concessionDetails: std.feeRecord?.concessionDetails || "",
				admissionFeePaid: std.feeRecord?.admissionFeePaid || "0",
				transportFeePaid: std.feeRecord?.transportFeePaid || "0",
				securityDepositPaid: std.feeRecord?.securityDepositPaid || "0",
				tuitionFeeCycle: std.feeRecord?.tuitionFeeCycle || "QUARTERLY",
				paymentMode: std.feeRecord?.paymentMode || "CASH",
				bankName: std.feeRecord?.bankName || "",
				accountNumber: std.feeRecord?.accountNumber || "",
				ifscCode: std.feeRecord?.ifscCode || "",
				branchNameAndCode: std.feeRecord?.branchNameAndCode || "",

				needTransport: std.transportProfile?.needTransport
					? "Yes"
					: "No",
				pickupPoint: std.transportProfile?.pickupPoint || "",
				route: std.transportProfile?.route || "",
			});
		} catch (err) {
			alert(err.message);
			setIsModalOpen(false);
		} finally {
			setLoadingDetails(false);
		}
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			const response = await fetch(
				`/api/school/students/${selectedStudent.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				},
			);
			if (!response.ok)
				throw new Error("Full update transaction failed.");
			setIsEditing(false);
			fetchStudents();
			handleViewClick(selectedStudent.id);
		} catch (err) {
			alert(err.message);
		} finally {
			setIsSaving(false);
		}
	};


	const CLASSES = [
		"All",
		"Nursery",
		"LKG",
		"UKG",
		"Class 1st",
		"Class 2nd",
		"Class 3rd",
		"Class 4th",
		"Class 5th",
		"Class 6th",
		"Class 7th",
		"Class 8th",
		"Class 9th",
		"Class 10th",
		"Class 11th",
		"Class 12th",
	];
	const SECTIONS = [
		"All",
		"Section A",
		"Section B",
		"Section C",
		"Section D",
		"Section E",
	];



	const handleCloseModal = () => {
		setIsModalOpen(false);
		setTimeout(() => setSelectedStudent(null), 300);
	};

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const filteredStudents = students.filter((student) => {
		// Null safety ke liye default strings add kiye hain
		const safeName = student?.name || "";
		const safeRoll = student?.rollNumber || "";

		const matchesSearch =
			safeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			safeRoll.toLowerCase().includes(searchTerm.toLowerCase());

		// .includes() ki jagah strict (===) match lagaya hai
		const matchesClass =
			selectedClass === "All" || student.class === selectedClass;

		// Yeh matchesSection check pehle MISSING tha
		const matchesSection =
			selectedSection === "All" || student.section === selectedSection;

		const matchesRoute =
			routeFilter === "All" ||
			(routeFilter === "Transport" &&
				student.route !== "Self / Private") ||
			(routeFilter === "Self" && student.route === "Self / Private");

		const matchesStatus =
			statusFilter === "All" || student.status === statusFilter;

		// Yahan matchesSection ko final return mein add kar diya hai
		return (
			matchesSearch &&
			matchesClass &&
			matchesSection &&
			matchesRoute &&
			matchesStatus
		);
	});
	

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-8 animate-in fade-in duration-500 relative">
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
					<div>
						<h2 className="text-2xl font-bold text-slate-800 tracking-tight">
							Student Directory
						</h2>
						<p className="text-sm text-slate-500 mt-1">
							Manage, filter, and modify full admission dossiers.
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
							className="w-full text-sm p-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
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
							className="w-full text-sm p-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
						>
							<option value="All">All Routes</option>
							<option value="Transport">School Bus</option>
							<option value="Self">Self / Private</option>
						</select>
					</div>
					<div>
						<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
							Status
						</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full text-sm p-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
						>
							<option value="All">All Statuses</option>
							<option value="Active">Active Only</option>
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
								<th className="p-4">Phone Number</th>
								<th className="p-4 text-center">Attendance</th>
								<th className="p-4">DOB</th>
								<th className="p-4 text-right">Due Amount</th>
								<th className="p-4 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
							{loading ? (
								<tr>
									<td
										colSpan="8"
										className="p-12 text-center text-slate-400 animate-pulse"
									>
										Syncing school grid database...
									</td>
								</tr>
							) : filteredStudents.length > 0 ? (
								filteredStudents.map((student) => (
									<tr
										key={student.id}
										className="hover:bg-slate-50/80 transition-colors group"
									>
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
												{student.attendance}
											</span>
										</td>
										<td className="p-4 text-slate-500">
											{student.dob}
										</td>
										<td className="p-4 text-right font-bold text-rose-600">
											₹
											{student.dueAmount.toLocaleString(
												"en-IN",
											)}
										</td>
										<td className="p-4 text-center">
											<button
												onClick={() =>
													handleViewClick(student.id)
												}
												className="text-xs font-bold text-indigo-600 hover:text-white border border-indigo-100 bg-indigo-50 hover:bg-indigo-600 rounded-lg px-3 py-1.5 transition-all"
											>
												View & Edit
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="8"
										className="p-12 text-center text-slate-500 font-medium"
									>
										No matching student rows found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* --- COMPREHENSIVE TABS-BASED VIEW & EDIT MODAL --- */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
						{/* Modal Top Header */}
						<div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
							<div>
								<h3 className="font-bold text-xl text-slate-800">
									{isEditing
										? "🖊️ Edit Admission Dossier"
										: "👁️ Student Full Record File"}
								</h3>
								<p className="text-xs text-slate-400 mt-0.5">
									Roll Number:{" "}
									<span className="font-mono text-slate-700">
										{formData.rollNumber || "Not Set"}
									</span>
								</p>
							</div>
							<button
								onClick={handleCloseModal}
								className="text-slate-400 hover:text-rose-500 transition-colors bg-white border p-1.5 rounded-full"
							>
								✕
							</button>
						</div>

						{/* Navigation Tabs Bar */}
						<div className="flex border-b border-slate-100 bg-slate-50/50 px-5 gap-2 overflow-x-auto text-xs font-bold uppercase tracking-wider text-slate-500">
							{[
								{ id: "studentInfo", label: "Student Details" },
								{ id: "academic", label: "Academic Info" },
								{ id: "family", label: "Parent Details" },
								{ id: "address", label: "Address & Medical" },
								{ id: "financial", label: "Fees & Transport" },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-3.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent hover:text-slate-700"}`}
								>
									{tab.label}
								</button>
							))}
						</div>

						{/* Dynamic Form Content Layout */}
						<div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
							{loadingDetails ? (
								<div className="flex justify-center items-center h-40">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
									{/* TAB 1: Student Core Info */}
									{activeTab === "studentInfo" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Admission Date
												</label>
												{isEditing ? (
													<input
														type="date"
														name="admissionDate"
														value={
															formData.admissionDate
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.admissionDate ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Roll Number
												</label>
												{isEditing ? (
													<input
														name="rollNumber"
														value={
															formData.rollNumber
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.rollNumber ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													First Name
												</label>
												{isEditing ? (
													<input
														name="firstName"
														value={
															formData.firstName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.firstName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Last Name
												</label>
												{isEditing ? (
													<input
														name="lastName"
														value={
															formData.lastName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.lastName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Gender
												</label>
												{isEditing ? (
													<select
														name="gender"
														value={formData.gender}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="MALE">
															Male
														</option>
														<option value="FEMALE">
															Female
														</option>
														<option value="OTHER">
															Other
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.gender ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Date of Birth
												</label>
												{isEditing ? (
													<input
														type="date"
														name="dob"
														value={formData.dob}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.dob || "N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Blood Group
												</label>
												{isEditing ? (
													<input
														name="bloodGroup"
														value={
															formData.bloodGroup
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.bloodGroup ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Category
												</label>
												{isEditing ? (
													<select
														name="category"
														value={
															formData.category
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="GENERAL">
															General
														</option>
														<option value="OBC">
															OBC
														</option>
														<option value="SC">
															SC
														</option>
														<option value="ST">
															ST
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.category ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Religion
												</label>
												{isEditing ? (
													<input
														name="religion"
														value={
															formData.religion
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.religion ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Nationality
												</label>
												{isEditing ? (
													<input
														name="nationality"
														value={
															formData.nationality
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.nationality ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Aadhar Card Number
												</label>
												{isEditing ? (
													<input
														name="aadhar"
														value={formData.aadhar}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.aadhar ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													ABC ID
												</label>
												{isEditing ? (
													<input
														name="abcId"
														value={formData.abcId}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.abcId ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													PAN Card Number
												</label>
												{isEditing ? (
													<input
														name="panNumber"
														value={
															formData.panNumber
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.panNumber ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Staff Child?
												</label>
												{isEditing ? (
													<select
														name="isStaffChild"
														value={
															formData.isStaffChild
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="No">
															No
														</option>
														<option value="Yes">
															Yes
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.isStaffChild ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Visible Identification Mark
												</label>
												{isEditing ? (
													<input
														name="identificationMark"
														value={
															formData.identificationMark
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.identificationMark ||
															"N/A"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 2: Academic Info */}
									{activeTab === "academic" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Class Applying For
												</label>
												{isEditing ? (
													<input
														name="classApplyingFor"
														value={
															formData.classApplyingFor
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.classApplyingFor ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Section Assignment
												</label>
												{isEditing ? (
													<input
														name="section"
														value={formData.section}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.section ||
															"Not Assigned"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Academic Session Year
												</label>
												{isEditing ? (
													<input
														name="academicSession"
														value={
															formData.academicSession
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.academicSession ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Previous School Name
												</label>
												{isEditing ? (
													<input
														name="previousSchool"
														value={
															formData.previousSchool
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.previousSchool ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Previous Attended Class
												</label>
												{isEditing ? (
													<input
														name="previousClass"
														value={
															formData.previousClass
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.previousClass ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Transfer Certificate (TC) No
												</label>
												{isEditing ? (
													<input
														name="tcNumber"
														value={
															formData.tcNumber
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.tcNumber ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Previous School UDISE Code
												</label>
												{isEditing ? (
													<input
														name="previousUdiseCode"
														value={
															formData.previousUdiseCode
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.previousUdiseCode ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Medium of Instruction
												</label>
												{isEditing ? (
													<input
														name="previousMediumOfInstruction"
														value={
															formData.previousMediumOfInstruction
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.previousMediumOfInstruction ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Board Registration Number
												</label>
												{isEditing ? (
													<input
														name="boardRegistrationNumber"
														value={
															formData.boardRegistrationNumber
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.boardRegistrationNumber ||
															"N/A"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 3: Parent Context Details */}
									{activeTab === "family" && (
										<>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Marital Status of Parents
												</label>
												{isEditing ? (
													<input
														name="parentsMaritalStatus"
														value={
															formData.parentsMaritalStatus
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.parentsMaritalStatus ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Legal Custody Holder
												</label>
												{isEditing ? (
													<input
														name="legalCustodyHolder"
														value={
															formData.legalCustodyHolder
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.legalCustodyHolder ||
															"N/A"}
													</p>
												)}
											</div>
											<div className="sm:col-span-3 border-t pt-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Father Profiles
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Father's Full Name
												</label>
												{isEditing ? (
													<input
														name="fatherName"
														value={
															formData.fatherName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.fatherName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Father's Mobile No
												</label>
												{isEditing ? (
													<input
														name="fatherMobile"
														value={
															formData.fatherMobile
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.fatherMobile ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Father's Occupation
												</label>
												{isEditing ? (
													<input
														name="fatherOccupation"
														value={
															formData.fatherOccupation
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.fatherOccupation ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Father's Annual Income
												</label>
												{isEditing ? (
													<input
														name="fatherIncome"
														value={
															formData.fatherIncome
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.fatherIncome ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Father's Email ID
												</label>
												{isEditing ? (
													<input
														name="fatherEmail"
														value={
															formData.fatherEmail
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.fatherEmail ||
															"N/A"}
													</p>
												)}
											</div>

											<div className="sm:col-span-3 border-t pt-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Mother Profiles
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Mother's Full Name
												</label>
												{isEditing ? (
													<input
														name="motherName"
														value={
															formData.motherName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.motherName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Mother's Mobile No
												</label>
												{isEditing ? (
													<input
														name="motherMobile"
														value={
															formData.motherMobile
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.motherMobile ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Mother's Occupation
												</label>
												{isEditing ? (
													<input
														name="motherOccupation"
														value={
															formData.motherOccupation
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.motherOccupation ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Mother's Email ID
												</label>
												{isEditing ? (
													<input
														name="motherEmail"
														value={
															formData.motherEmail
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.motherEmail ||
															"N/A"}
													</p>
												)}
											</div>

											<div className="sm:col-span-3 border-t pt-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Siblings Tracker
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Any Sibling Studying Here?
												</label>
												{isEditing ? (
													<select
														name="siblingStudyingHere"
														value={
															formData.siblingStudyingHere
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="No">
															No
														</option>
														<option value="Yes">
															Yes
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.siblingStudyingHere ||
															"No"}
													</p>
												)}
											</div>
											<div className="sm:col-span-2">
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Sibling Class/Roll Details
												</label>
												{isEditing ? (
													<input
														name="siblingDetails"
														value={
															formData.siblingDetails
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.siblingDetails ||
															"None"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 4: Address & Medical Fields */}
									{activeTab === "address" && (
										<>
											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Residential Address Info
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													House / Flat No
												</label>
												{isEditing ? (
													<input
														name="houseNo"
														value={formData.houseNo}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.houseNo ||
															"N/A"}
													</p>
												)}
											</div>
											<div className="sm:col-span-2">
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Street / Locality Address
												</label>
												{isEditing ? (
													<input
														name="street"
														value={formData.street}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.street ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													City / Town
												</label>
												{isEditing ? (
													<input
														name="city"
														value={formData.city}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.city || "N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													District
												</label>
												{isEditing ? (
													<input
														name="district"
														value={
															formData.district
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.district ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													State
												</label>
												{isEditing ? (
													<input
														name="state"
														value={formData.state}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.state ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Pincode
												</label>
												{isEditing ? (
													<input
														name="pincode"
														value={formData.pincode}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.pincode ||
															"N/A"}
													</p>
												)}
											</div>

											<div className="sm:col-span-3 border-t pt-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Emergency & Medical Profile
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Emergency Contact Person
												</label>
												{isEditing ? (
													<input
														name="emergencyContact"
														value={
															formData.emergencyContact
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.emergencyContact ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Emergency Contact Mobile
												</label>
												{isEditing ? (
													<input
														name="emergencyMobile"
														value={
															formData.emergencyMobile
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.emergencyMobile ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Relation with Student
												</label>
												{isEditing ? (
													<input
														name="emergencyRelation"
														value={
															formData.emergencyRelation
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.emergencyRelation ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Family Doctor Name
												</label>
												{isEditing ? (
													<input
														name="familyDoctorName"
														value={
															formData.familyDoctorName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.familyDoctorName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Doctor Contact Mobile
												</label>
												{isEditing ? (
													<input
														name="familyDoctorMobile"
														value={
															formData.familyDoctorMobile
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.familyDoctorMobile ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Preferred Hospital Name
												</label>
												{isEditing ? (
													<input
														name="preferredHospital"
														value={
															formData.preferredHospital
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.preferredHospital ||
															"N/A"}
													</p>
												)}
											</div>
											<div className="sm:col-span-2">
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Chronic Medical Conditions
												</label>
												{isEditing ? (
													<textarea
														name="medicalConditions"
														value={
															formData.medicalConditions
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm h-10"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.medicalConditions ||
															"None"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Known Allergies
												</label>
												{isEditing ? (
													<input
														name="allergies"
														value={
															formData.allergies
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.allergies ||
															"None"}
													</p>
												)}
											</div>
										</>
									)}

									{/* TAB 5: Financials & Transport Rules */}
									{activeTab === "financial" && (
										<>
											<div className="sm:col-span-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Fee structure & ledger records
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Fee Allocation Category
												</label>
												{isEditing ? (
													<select
														name="feeCategory"
														value={
															formData.feeCategory
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="GENERAL">
															General
														</option>
														<option value="STAFF_DISCOUNT">
															Staff Discount
														</option>
														<option value="SIBLING_DISCOUNT">
															Sibling Discount
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.feeCategory ||
															"GENERAL"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Availed Scholarship?
												</label>
												{isEditing ? (
													<select
														name="scholarship"
														value={
															formData.scholarship
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="No">
															No
														</option>
														<option value="Yes">
															Yes
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.scholarship ||
															"No"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Concession Details Note
												</label>
												{isEditing ? (
													<input
														name="concessionDetails"
														value={
															formData.concessionDetails
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.concessionDetails ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Admission Fee Paid (₹)
												</label>
												{isEditing ? (
													<input
														type="number"
														name="admissionFeePaid"
														value={
															formData.admissionFeePaid
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														₹
														{
															formData.admissionFeePaid
														}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Transport Fee Paid (₹)
												</label>
												{isEditing ? (
													<input
														type="number"
														name="transportFeePaid"
														value={
															formData.transportFeePaid
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														₹
														{
															formData.transportFeePaid
														}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Security Deposit Deposited
													(₹)
												</label>
												{isEditing ? (
													<input
														type="number"
														name="securityDepositPaid"
														value={
															formData.securityDepositPaid
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														₹
														{
															formData.securityDepositPaid
														}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Tuition Billing Cycle
												</label>
												{isEditing ? (
													<select
														name="tuitionFeeCycle"
														value={
															formData.tuitionFeeCycle
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="MONTHLY">
															Monthly
														</option>
														<option value="QUARTERLY">
															Quarterly
														</option>
														<option value="ANNUALLY">
															Annually
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{
															formData.tuitionFeeCycle
														}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Payment Settlement Mode
												</label>
												{isEditing ? (
													<select
														name="paymentMode"
														value={
															formData.paymentMode
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="CASH">
															Cash
														</option>
														<option value="BANK_TRANSFER">
															Bank Transfer
														</option>
														<option value="CHEQUE">
															Cheque
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.paymentMode}
													</p>
												)}
											</div>

											<div className="sm:col-span-3 border-t pt-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												Bank Account Details
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Bank Name
												</label>
												{isEditing ? (
													<input
														name="bankName"
														value={
															formData.bankName
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.bankName ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Account Number
												</label>
												{isEditing ? (
													<input
														name="accountNumber"
														value={
															formData.accountNumber
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.accountNumber ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													IFSC Code
												</label>
												{isEditing ? (
													<input
														name="ifscCode"
														value={
															formData.ifscCode
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.ifscCode ||
															"N/A"}
													</p>
												)}
											</div>

											<div className="sm:col-span-3 border-t pt-3 font-bold text-slate-700 text-xs uppercase tracking-wide">
												School Bus Transport Setup
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Requires School Transport?
												</label>
												{isEditing ? (
													<select
														name="needTransport"
														value={
															formData.needTransport
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													>
														<option value="No">
															No
														</option>
														<option value="Yes">
															Yes
														</option>
													</select>
												) : (
													<p className="text-sm font-semibold">
														{formData.needTransport ||
															"No"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Pickup Point Station
												</label>
												{isEditing ? (
													<input
														name="pickupPoint"
														value={
															formData.pickupPoint
														}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.pickupPoint ||
															"N/A"}
													</p>
												)}
											</div>
											<div>
												<label className="text-xs font-bold text-slate-400 block mb-1">
													Allocated Route Code
												</label>
												{isEditing ? (
													<input
														name="route"
														value={formData.route}
														onChange={handleChange}
														className="w-full p-2 border rounded-md text-sm"
													/>
												) : (
													<p className="text-sm font-semibold">
														{formData.route ||
															"Self / Private"}
													</p>
												)}
											</div>
										</>
									)}
								</div>
							)}
						</div>

						{/* Modal Action Controls Footer */}
						<div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
								{isEditing
									? "🖊️ Sandbox Edit Active"
									: "👁️ Safe Read Only"}
							</span>
							<div className="flex gap-3">
								<button
									onClick={handleCloseModal}
									className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
								>
									Cancel
								</button>
								{isEditing ? (
									<button
										onClick={handleSave}
										disabled={isSaving}
										className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100"
									>
										{isSaving
											? "Saving updates..."
											: "Commit Full Changes"}
									</button>
								) : (
									<button
										onClick={() => setIsEditing(true)}
										className="px-6 py-2 text-sm font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-xl transition-all shadow-xs"
									>
										Edit Entire File
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

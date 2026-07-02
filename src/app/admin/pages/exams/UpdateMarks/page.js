"use client";
import { Section } from "lucide-react";
import React, { useState, useEffect } from "react";

const MarksEntry = () => {

	// STATE UPDATE: Class aur Section ab alag alag hain
	const [filters, setFilters] = useState({
		className: "Nursery",
		section: "Section A",
		examType: "Mid-Term",
		subject: "Science",
	});

	const [students, setStudents] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [saveStatus, setSaveStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const Classes = [
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
	const Sections = [
		"Section A",
		"Section B",
		"Section C",
		"Section D",
		"Section E",
		"Section F",
	];

	useEffect(() => {
		fetchStudentsData();
	}, [filters]);

	const fetchStudentsData = async () => {
		setIsLoading(true);
		try {
			const queryParams = new URLSearchParams({
				...filters,
				
			}).toString();
			const response = await fetch(
				`/api/school/students/marks/add?${queryParams}`,
			);
			const data = await response.json();
			setStudents(data);
		} catch (error) {
			console.error("Error fetching students:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters({ ...filters, [name]: value });
	};

	// Auto-Calculation Logic (Same as before)
	const handleStudentDataChange = (id, field, value) => {
		setStudents((prevStudents) =>
			prevStudents.map((student) => {
				if (student.id === id) {
					const updatedStudent = { ...student, [field]: value };

					if (
						[
							"theoryObtained",
							"practicalObtained",
							"internalObtained",
							"isAbsent",
						].includes(field)
					) {
						if (updatedStudent.isAbsent) {
							updatedStudent.theoryObtained = "0";
							updatedStudent.practicalObtained = "0";
							updatedStudent.internalObtained = "0";
							updatedStudent.totalObtained = "0";
						} else {
							const theory =
								parseFloat(updatedStudent.theoryObtained) || 0;
							const practical =
								parseFloat(updatedStudent.practicalObtained) ||
								0;
							const internal =
								parseFloat(updatedStudent.internalObtained) ||
								0;

							if (
								updatedStudent.theoryObtained === "" &&
								updatedStudent.practicalObtained === "" &&
								updatedStudent.internalObtained === ""
							) {
								updatedStudent.totalObtained = "";
							} else {
								updatedStudent.totalObtained = (
									theory +
									practical +
									internal
								).toString();
							}
						}
					}
					return updatedStudent;
				}
				return student;
			}),
		);
	};

	const handleSaveMarks = async (e) => {
		e.preventDefault();
		setSaveStatus("Saving...");

		const payload = {
			filters,
			marksData: students,
			
		};

		try {
			const response = await fetch("/api/school/students/marks/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				setSaveStatus("Marks saved successfully!");
				setIsEditing(false);
			} else {
				setSaveStatus("Failed to save marks.");
			}
		} catch (error) {
			console.error("Error saving marks:", error);
			setSaveStatus("Error connecting to server.");
		} finally {
			setTimeout(() => setSaveStatus(null), 3000);
		}
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Marks Entry & Editing
				</h1>
				<p className="text-gray-600">
					Enter or update student examination marks subject-wise.
				</p>
			</div>

			{/* FILTER SECTION */}
			<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
				{/* Changed to 4 columns grid for Class, Section, ExamType, Subject */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Class Dropdown */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Class
						</label>
						<select
							name="className"
							value={filters.className}
							onChange={handleFilterChange}
							className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
						>
							{Classes.map((cls) => (
								<option key={cls} value={cls}>
									{cls}
								</option>
							))}
						</select>
					</div>

					{/* New Section Dropdown */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Section
						</label>
						<select
							name="section"
							value={filters.section}
							onChange={handleFilterChange}
							className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
						>
							{Sections.map((sec) => (
								<option key={sec} value={sec}>
									{sec}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Exam Type
						</label>
						<select
							name="examType"
							value={filters.examType}
							onChange={handleFilterChange}
							className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="Mid-Term">Mid-Term</option>
							<option value="Finals">Finals</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Subject
						</label>
						<select
							name="subject"
							value={filters.subject}
							onChange={handleFilterChange}
							className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="Science">Science</option>
							<option value="Mathematics">Mathematics</option>
							<option value="English">English</option>
						</select>
					</div>
				</div>
			</div>

			{/* MARKS ENTRY TABLE */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
					<h2 className="text-lg font-semibold text-gray-700">
						Student List
					</h2>
					<div>
						{!isEditing ? (
							<button
								onClick={() => setIsEditing(true)}
								className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition duration-150 text-sm"
							>
								Edit Marks
							</button>
						) : (
							<span className="text-sm text-blue-600 font-medium animate-pulse">
								Editing Mode Active
							</span>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className="p-8 text-center text-gray-500">
						Loading student data...
					</div>
				) : (
					<form onSubmit={handleSaveMarks}>
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-white text-gray-600 text-xs uppercase tracking-wider border-b">
										<th className="p-3 font-medium w-20">
											Roll No.
										</th>
										<th className="p-3 font-medium">
											Student Name
										</th>
										<th className="p-3 font-medium w-20 text-center">
											Absent
										</th>
										<th className="p-3 font-medium w-24">
											Theory
										</th>
										<th className="p-3 font-medium w-24">
											Practical
										</th>
										<th className="p-3 font-medium w-24">
											Internal
										</th>
										<th className="p-3 font-medium w-24">
											Total
										</th>
										<th className="p-3 font-medium w-48">
											Remarks
										</th>
									</tr>
								</thead>
								<tbody className="text-sm text-gray-700 divide-y divide-gray-200">
									{/* SAFEGUARD: Pehle check karo ki students ek Array hai ya nahi */}
									{Array.isArray(students) &&
									students.length > 0 ? (
										students.map((student) => (
											<tr
												key={student.id}
												className="hover:bg-gray-50 transition duration-150"
											>
												<td className="p-3 font-medium text-gray-500">
													{student.rollNo}
												</td>
												<td className="p-3 font-semibold">
													{student.name}
												</td>

												{/* Absent Toggle */}
												<td className="p-3 text-center">
													<input
														type="checkbox"
														checked={
															student.isAbsent ||
															false
														}
														onChange={(e) =>
															handleStudentDataChange(
																student.id,
																"isAbsent",
																e.target
																	.checked,
															)
														}
														disabled={!isEditing}
														className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
													/>
												</td>

												{/* Theory */}
												<td className="p-3">
													<input
														type="number"
														step="0.5"
														min="0"
														value={
															student.theoryObtained ||
															""
														}
														onChange={(e) =>
															handleStudentDataChange(
																student.id,
																"theoryObtained",
																e.target.value,
															)
														}
														disabled={
															!isEditing ||
															student.isAbsent
														}
														className={`w-full border rounded-md p-2 text-sm text-center ${!isEditing || student.isAbsent ? "bg-gray-100 border-transparent text-gray-500" : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
														placeholder="--"
													/>
												</td>

												{/* Practical */}
												<td className="p-3">
													<input
														type="number"
														step="0.5"
														min="0"
														value={
															student.practicalObtained ||
															""
														}
														onChange={(e) =>
															handleStudentDataChange(
																student.id,
																"practicalObtained",
																e.target.value,
															)
														}
														disabled={
															!isEditing ||
															student.isAbsent
														}
														className={`w-full border rounded-md p-2 text-sm text-center ${!isEditing || student.isAbsent ? "bg-gray-100 border-transparent text-gray-500" : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
														placeholder="--"
													/>
												</td>

												{/* Internal */}
												<td className="p-3">
													<input
														type="number"
														step="0.5"
														min="0"
														value={
															student.internalObtained ||
															""
														}
														onChange={(e) =>
															handleStudentDataChange(
																student.id,
																"internalObtained",
																e.target.value,
															)
														}
														disabled={
															!isEditing ||
															student.isAbsent
														}
														className={`w-full border rounded-md p-2 text-sm text-center ${!isEditing || student.isAbsent ? "bg-gray-100 border-transparent text-gray-500" : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
														placeholder="--"
													/>
												</td>

												{/* Total */}
												<td className="p-3">
													<input
														type="number"
														value={
															student.totalObtained ||
															""
														}
														readOnly
														className="w-full border-transparent bg-gray-100 rounded-md p-2 text-sm text-center text-gray-800 font-bold focus:outline-none"
														placeholder="--"
													/>
												</td>

												{/* Remarks */}
												<td className="p-3">
													<input
														type="text"
														value={
															student.remarks ||
															""
														}
														onChange={(e) =>
															handleStudentDataChange(
																student.id,
																"remarks",
																e.target.value,
															)
														}
														disabled={!isEditing}
														className={`w-full border rounded-md p-2 text-sm ${!isEditing ? "bg-gray-100 border-transparent text-gray-500" : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
														placeholder="Remarks"
													/>
												</td>
											</tr>
										))
									) : (
										/* Agar error aayi ya students khali hain, toh ye row dikhegi aur app crash nahi hoga */
										<tr>
											<td
												colSpan="8"
												className="p-8 text-center text-gray-500 bg-red-50/50"
											>
												No students found or failed to
												load data from API. Please check
												your network or filters.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
							<div
								className={`text-sm font-medium ${saveStatus?.includes("Error") ? "text-red-600" : "text-green-600"}`}
							>
								{saveStatus}
							</div>
							{isEditing && (
								<button
									type="submit"
									className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition duration-150 shadow-sm"
								>
									Save All Marks
								</button>
							)}
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default MarksEntry;

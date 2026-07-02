"use client";
import React, { useState } from "react";
import {
	Printer,
	Search,
	LayoutTemplate,
	AlertCircle,
	Loader2,
} from "lucide-react";

// Agar aapka Marksheet Renderer component ready hai toh isey import karein
// import MarksheetRenderer from "@/components/marksheet/MarksheetRenderer";

export default function MarksheetStudio() {
	// --- HARDCODED STATIC LISTS ---
	const CLASS_OPTIONS = [
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
	const SECTION_OPTIONS = ["Section A", "Section B", "Section C", "Section D", "Section E"];

	// Available Templates
	const templates = [
		{ id: "cbse", name: "CBSE Standard" },
		{ id: "modern", name: "Modern Minimal" },
		{ id: "oxeford", name: "Oxford Classic" },
		{ id: "kv", name: "Kendriya Vidyalaya" },
		{ id: "convent", name: "Convent Premium" },
	];

	// --- STATES ---
	const [selectedTemplate, setSelectedTemplate] = useState("cbse");
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedSection, setSelectedSection] = useState("");
	const [rollNumber, setRollNumber] = useState("");

	const [studentData, setStudentData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// --- FETCH SINGLE STUDENT RESULT ---
	const handleGeneratePreview = async (e) => {
		e.preventDefault();
		if (!selectedClass || !selectedSection || !rollNumber) {
			setError("Please select Class, Section and enter Roll Number.");
			return;
		}

		setLoading(true);
		setError("");
		setStudentData(null); // Puraana data clear karein

		try {
			// API call with selected parameters
			const res = await fetch(
				`/api/school/students/marksheet?class=${selectedClass}&section=${selectedSection}&rollNumber=${rollNumber}`,
			);
			const json = await res.json();

			if (json.success && json.data.length > 0) {
				setStudentData(json.data[0]); // Pura student data fetch ho gaya
			} else {
				setError(
					json.message ||
						"No student found with this Roll Number in selected Class & Section.",
				);
			}
		} catch (err) {
			setError(
				"Server error while fetching marksheet. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	// --- PRINT HANDLER ---
	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
			{/* LEFT PANEL: CONTROLS (Hide this panel while printing) */}
			<div className="w-full lg:w-1/3 p-6 bg-white border-r border-slate-200 print:hidden shadow-sm z-10">
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-slate-800">
						Marksheet Studio
					</h2>
					<p className="text-sm text-slate-500">
						Generate & Preview student report card
					</p>
				</div>

				<form onSubmit={handleGeneratePreview} className="space-y-5">
					{/* Template Selection */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
							<LayoutTemplate size={16} /> Choose Design Template
						</label>
						<select
							value={selectedTemplate}
							onChange={(e) =>
								setSelectedTemplate(e.target.value)
							}
							className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						>
							{templates.map((tpl) => (
								<option key={tpl.id} value={tpl.id}>
									{tpl.name}
								</option>
							))}
						</select>
					</div>

					{/* Class Selection (Hardcoded) */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Select Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						>
							<option value="">-- Choose Class --</option>
							{CLASS_OPTIONS.map((cls) => (
								<option key={cls} value={cls}>
									{cls}
								</option>
							))}
						</select>
					</div>

					{/* Section Selection (Hardcoded) */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Select Section
						</label>
						<select
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value)}
							disabled={!selectedClass}
							className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
						>
							<option value="">-- Choose Section --</option>
							{SECTION_OPTIONS.map((sec) => (
								<option key={sec} value={sec}>
									{sec}
								</option>
							))}
						</select>
					</div>

					{/* Roll Number Input */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Roll Number
						</label>
						<input
							type="text"
							value={rollNumber}
							onChange={(e) => setRollNumber(e.target.value)}
							placeholder="e.g. 12"
							className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>

					{/* Error Message */}
					{error && (
						<div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
							<AlertCircle size={16} /> {error}
						</div>
					)}

					{/* Action Buttons */}
					<button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-all"
					>
						{loading ? (
							<Loader2 className="animate-spin" size={20} />
						) : (
							<Search size={20} />
						)}
						Fetch Data & Preview
					</button>

					<button
						type="button"
						onClick={handlePrint}
						disabled={!studentData}
						className="w-full flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-slate-300 transition-all"
					>
						<Printer size={20} /> Print Marksheet
					</button>
				</form>
			</div>

			{/* RIGHT PANEL: LIVE PREVIEW */}
			<div className="w-full lg:w-2/3 p-4 md:p-8 flex justify-center overflow-y-auto bg-slate-200 print:bg-white print:p-0">
				{studentData ? (
					<div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none print:w-full">
						{/* Yahan aapka Asli Marksheet Template Render hoga.
              <MarksheetRenderer template={selectedTemplate} data={studentData} /> 
            */}

						<div className="p-10 border-4 border-double border-slate-800 h-full">
							<div className="text-center mb-6">
								<h1 className="text-4xl font-bold uppercase tracking-wider">
									{selectedTemplate} Marksheet
								</h1>
								<h2 className="text-xl mt-2 font-semibold text-slate-600">
									ACADEMIC SESSION 2025-2026
								</h2>
							</div>

							{/* Fetched Student Info */}
							<div className="grid grid-cols-2 gap-4 border-t-2 border-b-2 border-slate-800 py-4 mb-8">
								<p className="text-lg">
									<strong>Student Name:</strong>{" "}
									{studentData.firstName}{" "}
									{studentData.lastName}
								</p>
								<p className="text-lg">
									<strong>Roll No:</strong> {rollNumber}
								</p>
								<p className="text-lg">
									<strong>Class:</strong> {selectedClass}
								</p>
								<p className="text-lg">
									<strong>Section:</strong> {selectedSection}
								</p>
							</div>

							{/* Render Fetched Marks Dynamically */}
							<div className="mt-8">
								<h3 className="font-bold text-lg mb-3">
									Examination Results:
								</h3>

								{studentData.examResults &&
								studentData.examResults.length > 0 ? (
									studentData.examResults.map((exam, idx) => (
										<div key={idx} className="mb-6">
											<h4 className="bg-slate-100 p-2 font-semibold text-slate-800 border border-slate-300">
												{exam.examName ||
													"Term Examination"}
											</h4>
											<table className="w-full border-collapse border border-slate-300 mt-2 text-sm">
												<thead>
													<tr className="bg-slate-50">
														<th className="border border-slate-300 p-2 text-left">
															Subject
														</th>
														<th className="border border-slate-300 p-2 text-center">
															Max Marks
														</th>
														<th className="border border-slate-300 p-2 text-center">
															Marks Obtained
														</th>
														<th className="border border-slate-300 p-2 text-center">
															Grade
														</th>
													</tr>
												</thead>
												<tbody>
													{exam.subjectMarks?.map(
														(sub, sIdx) => (
															<tr key={sIdx}>
																<td className="border border-slate-300 p-2">
																	{
																		sub.subjectName
																	}
																</td>
																<td className="border border-slate-300 p-2 text-center">
																	{sub.totalMax ||
																		sub.theoryMax ||
																		"-"}
																</td>
																<td className="border border-slate-300 p-2 text-center">
																	{sub.isAbsent
																		? "AB"
																		: sub.totalObtained ||
																			sub.theoryObtained ||
																			"-"}
																</td>
																<td className="border border-slate-300 p-2 text-center">
																	{sub.grade ||
																		"-"}
																</td>
															</tr>
														),
													)}
												</tbody>
											</table>
										</div>
									))
								) : (
									<p className="text-red-500 font-semibold p-4 bg-red-50 border border-red-200">
										⚠ Student details fetched, but no marks
										found in the database for this student.
									</p>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl flex items-center justify-center border-2 border-dashed border-slate-300">
						<div className="text-slate-400 text-center">
							<LayoutTemplate
								size={48}
								className="mx-auto mb-4 opacity-50"
							/>
							<p className="text-lg">Preview will appear here</p>
							<p className="text-sm">
								Enter details and click Fetch Data
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

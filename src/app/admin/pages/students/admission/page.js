"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

// ==========================================
// 1. INLINE SVG ICONS (Zero Dependencies)
// ==========================================
const Icons = {
	Student: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2 14.5A2.5 2.5 0 0 0 4.5 17h15a2.5 2.5 0 0 0 2.5-2.5v-5a2.5 2.5 0 0 0-2.5-2.5h-15a2.5 2.5 0 0 0-2.5 2.5v5z" />
			<path d="M12 12v5" />
			<path d="M22 9l-10-4L2 9l10 4 10-4z" />
		</svg>
	),
	Book: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
		</svg>
	),
	Family: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	Home: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	),
	Medical: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
		</svg>
	),
	Money: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
			<path d="M12 18V6" />
		</svg>
	),
	Bank: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="9" y1="21" x2="9" y2="9" />
		</svg>
	),
	Key: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
			<circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
		</svg>
	),
	Upload: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="17 8 12 3 7 8" />
			<line x1="12" y1="3" x2="12" y2="15" />
		</svg>
	),
	Check: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	),
	Alert: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	),
	Info: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	),
};

// ==========================================
// 2. STATIC DATA & CONSTANTS
// ==========================================
const CONSTANTS = {
	STATES: [
		"Andhra Pradesh",
		"Arunachal Pradesh",
		"Assam",
		"Bihar",
		"Chhattisgarh",
		"Goa",
		"Gujarat",
		"Haryana",
		"Himachal Pradesh",
		"Jharkhand",
		"Karnataka",
		"Kerala",
		"Madhya Pradesh",
		"Maharashtra",
		"Manipur",
		"Meghalaya",
		"Mizoram",
		"Nagaland",
		"Odisha",
		"Punjab",
		"Rajasthan",
		"Sikkim",
		"Tamil Nadu",
		"Telangana",
		"Tripura",
		"Uttar Pradesh",
		"Uttarakhand",
		"West Bengal",
		"Andaman and Nicobar Islands",
		"Chandigarh",
		"Dadra and Nagar Haveli",
		"Daman and Diu",
		"Lakshadweep",
		"Delhi",
		"Puducherry",
	],
	BLOOD_GROUPS: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
	RELIGIONS: [
		"Hindu",
		"Muslim",
		"Christian",
		"Sikh",
		"Buddhist",
		"Jain",
		"Parsi",
		"Other",
	],
	CATEGORIES: ["General", "OBC", "SC", "ST", "EWS"],
	CLASSES: [
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
	],
	SECTIONS: ["Section A", "Section B", "Section C", "Section D", "Section E", " Section F"],
	PAYMENT_MODES: [
		"Cash",
		"Bank Transfer",
		"Credit Card",
		"Debit Card",
		"Cheque",
		"UPI",
		"Demand Draft",
	],
	FEE_CYCLES: ["Monthly", "Quarterly", "Half-Yearly", "Annually"],
	MAX_FILE_SIZE_MB: 2,
};

// ==========================================
// 3. REUSABLE UI COMPONENTS
// ==========================================
const FormInput = ({
	label,
	name,
	type = "text",
	required,
	value,
	onChange,
	onBlur,
	error,
	placeholder,
	icon,
	hint,
}) => (
	<div className="flex flex-col space-y-1 w-full relative">
		<label
			htmlFor={name}
			className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
		>
			{label}{" "}
			{required && <span className="text-red-500 text-sm">*</span>}
		</label>
		<div className="relative">
			<input
				id={name}
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				className={`block w-full rounded-lg shadow-sm text-sm p-3 transition-all duration-200 border outline-none
                    ${
						error
							? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
							: "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
					}
                `}
			/>
		</div>
		{hint && !error && (
			<p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
				<Icons.Info /> {hint}
			</p>
		)}
		{error && (
			<p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
				<span className="w-3 h-3">
					<Icons.Alert />
				</span>{" "}
				{error}
			</p>
		)}
	</div>
);

const FormSelect = ({
	label,
	name,
	required,
	value,
	onChange,
	onBlur,
	error,
	options,
	hint,
}) => (
	<div className="flex flex-col space-y-1 w-full">
		<label
			htmlFor={name}
			className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
		>
			{label}{" "}
			{required && <span className="text-red-500 text-sm">*</span>}
		</label>
		<select
			id={name}
			name={name}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			className={`block w-full rounded-lg shadow-sm text-sm p-3 transition-all duration-200 border outline-none appearance-none cursor-pointer
                ${
					error
						? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
						: "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
				}
            `}
		>
			<option value="" disabled>
				Select {label.replace("*", "")}
			</option>
			{options.map((opt) => (
				<option
					key={typeof opt === "string" ? opt : opt.value}
					value={typeof opt === "string" ? opt : opt.value}
				>
					{typeof opt === "string" ? opt : opt.label}
				</option>
			))}
		</select>
		{hint && !error && (
			<p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
				<Icons.Info /> {hint}
			</p>
		)}
		{error && (
			<p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
				<span className="w-3 h-3">
					<Icons.Alert />
				</span>{" "}
				{error}
			</p>
		)}
	</div>
);

const FormFile = ({
	label,
	name,
	required,
	onChange,
	error,
	accept = "image/*,.pdf",
	hint,
	fileData,
}) => {
	const fileUrl = fileData ? URL.createObjectURL(fileData) : null;
	const isImage = fileData?.type?.startsWith("image/");

	return (
		<div className="flex flex-col space-y-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 border-dashed hover:bg-slate-100 transition-colors">
			<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
				{label}{" "}
				{required && <span className="text-red-500 text-sm">*</span>}
			</label>

			<input
				type="file"
				name={name}
				id={name}
				accept={accept}
				onChange={onChange}
				// ✨ BULLETPROOF FIX: Array format ensures no \r\n characters are ever rendered
				className={[
					"block w-full text-sm text-slate-600",
					"file:mr-4 file:py-2.5 file:px-5",
					"file:rounded-full file:border-0",
					"file:text-xs file:font-bold",
					"file:bg-indigo-600 file:text-white",
					"hover:file:bg-indigo-700 hover:file:shadow-md",
					"file:transition-all file:cursor-pointer",
				].join(" ")}
			/>

			{hint && <p className="text-[11px] text-slate-500">{hint}</p>}

			{error && (
				<p className="text-xs text-red-600 font-medium flex items-center gap-1">
					<span className="w-3 h-3">
						<Icons.Alert />
					</span>{" "}
					{error}
				</p>
			)}

			{/* Image Preview Thumbnail */}
			{fileData && isImage && (
				<div className="mt-2 relative w-16 h-16 rounded-md overflow-hidden border border-slate-300 shadow-sm">
					<img
						src={fileUrl}
						alt="Preview"
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			{/* PDF/Doc Name Indicator */}
			{fileData && !isImage && (
				<div className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 w-fit p-1.5 rounded">
					<Icons.Check /> Attached: {fileData.name.substring(0, 20)}
					...
				</div>
			)}
		</div>
	);
};
// ==========================================
// 4. MAIN COMPONENT (STUDENT ADMISSION)
// ==========================================
export default function StudentAdmissionForm() {
	// --- 4.1 INITIAL STATE DEFINITIONS ---
	const initialFormData = {
		// Section 1: Student
		admissionDate: new Date().toISOString().split("T")[0],
		firstName: "",
		middleName: "",
		lastName: "",
		studentEmail: "",
		gender: "",
		dob: "",
		bloodGroup: "",
		category: "",
		religion: "",
		nationality: "Indian",
		isStaffChild: "No",
		identificationMark: "",
		aadhar: "",
		abcId: "",
		panNumber: "",
		samagraId: "",

		// Section 2: Academic
		classApplyingFor: "",
		section: "",
		previousSchool: "",
		previousClass: "",
		tcNumber: "",
		previousUdiseCode: "",
		previousMediumOfInstruction: "English",
		boardRegistrationNumber: "",

		// Section 3: Parent
		parentsMaritalStatus: "Married",
		legalCustodyHolder: "Both",
		parentEmail: "",
		fatherName: "",
		fatherMobile: "",
		fatherDob: "",
		fatherOccupation: "",
		fatherIncome: "",
		fatherEmail: "",
		motherName: "",
		motherMobile: "",
		motherDob: "",
		motherOccupation: "",
		motherEmail: "",
		siblingStudyingHere: "No",
		siblingDetails: "",

		// Section 4: Address
		houseNo: "",
		street: "",
		city: "",
		district: "",
		state: "",
		pincode: "",

		// Section 5: Medical
		emergencyContact: "",
		emergencyMobile: "",
		emergencyRelation: "",
		medicalConditions: "",
		allergies: "",
		familyDoctorName: "",
		familyDoctorMobile: "",
		preferredHospital: "",

		// Section 6: Fees
		feeCategory: "General",
		scholarship: "No",
		concessionDetails: "",
		admissionFeePaid: "",
		tuitionFeeCycle: "Monthly",
		transportFeePaid: "",
		securityDepositPaid: "",
		paymentMode: "Cash",

		// Section 7: Bank
		bankName: "",
		accountNumber: "",
		ifscCode: "",
		branchNameAndCode: "",

		// Section 8: Credentials
		studentUsername: "",
		studentPassword: "",
		fatherUsername: "",
		fatherPassword: "",
	};

	const initialFiles = {
		studentPhoto: null,
		studentAadhar: null,
		fatherAadhar: null,
		motherAadhar: null,
		studentBirthCertificate: null,
		studentCasteCertificate: null,
		domicileCertificate: null,
		familyId: null,
		studentTc: null,
		incomeCertificate: null,
		bplCertificate: null,
		previousMarksheet: null,
	};

	// --- 4.2 REACT HOOKS & STATE ---
	const [formData, setFormData] = useState(initialFormData);
	const [files, setFiles] = useState(initialFiles);

	// Validation States
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [fileErrors, setFileErrors] = useState({});

	// UI States
	const [isLoading, setIsLoading] = useState(false);
	const [submissionStatus, setSubmissionStatus] = useState({
		type: "",
		message: "",
	});
	const [activeSection, setActiveSection] = useState(1);

	// Form refs for smooth scrolling to errors
	const formRef = useRef(null);

	// --- 4.3 VALIDATION ENGINE ---
	const validateField = (name, value) => {
		let error = "";

		// General text requirements
		if (
			[
				"firstName",
				"lastName",
				"fatherName",
				"motherName",
				"street",
				"city",
				"district",
			].includes(name) &&
			!value.trim()
		) {
			error = "This field is required";
		}

		// Exact 12 digits (Aadhar)
		if (name === "aadhar" && value && !/^\d{12}$/.test(value)) {
			error = "Aadhar must be exactly 12 digits";
		}

		// Phone numbers
		if (
			["fatherMobile", "motherMobile", "emergencyMobile"].includes(
				name,
			) &&
			value
		) {
			if (!/^\d{10}$/.test(value))
				error = "Must be a valid 10-digit mobile number";
		}

		// Pincode
		if (name === "pincode" && value && !/^\d{6}$/.test(value)) {
			error = "Invalid pincode (6 digits required)";
		}

		// IFSC
		if (
			name === "ifscCode" &&
			value &&
			!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
		) {
			error = "Invalid IFSC Code format";
		}

		// Emails
		if (
			["studentEmail", "fatherEmail", "motherEmail"].includes(name) &&
			value
		) {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
				error = "Invalid email format";
		}

		return error;
	};

	// --- 4.4 HANDLERS ---
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		// Clear error as user types
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}

		setFormData((prev) => {
			const updated = { ...prev, [name]: value };

			// ==========================================
			// MAGIC CREDENTIAL AUTO-GENERATOR
			// ==========================================
			const clean = (str) =>
				str
					? str
							.split(" ")[0]
							.toLowerCase()
							.replace(/[^a-z0-9]/g, "")
					: "user";
			const cap = (str) => {
				const c = clean(str);
				return c.charAt(0).toUpperCase() + c.slice(1);
			};

			// Student Creds (Triggers on Name, Aadhar, or DOB change)
			if (["firstName", "aadhar", "dob"].includes(name)) {
				const sName = clean(updated.firstName);
				const aadharSuffix = updated.aadhar
					? updated.aadhar.slice(-4)
					: "0000";
				const birthYear = updated.dob
					? new Date(updated.dob).getFullYear()
					: new Date().getFullYear();

				updated.studentUsername = `stu_${sName}${aadharSuffix}`;
				if (updated.firstName)
					updated.studentPassword = `${cap(updated.firstName)}@${birthYear}`;
			}

			// Parent Creds (Triggers on Father Name, Mobile, or DOB change)
			if (["fatherName", "fatherMobile", "fatherDob"].includes(name)) {
				const pName = clean(updated.fatherName);
				const mobileSuffix = updated.fatherMobile
					? updated.fatherMobile.slice(-4)
					: "0000";
				const birthYear = updated.fatherDob
					? new Date(updated.fatherDob).getFullYear()
					: new Date().getFullYear();

				if (updated.fatherName)
					updated.fatherUsername = `prt_${pName}${mobileSuffix}`;
				if (updated.fatherName)
					updated.fatherPassword = `${cap(updated.fatherName)}@${birthYear}`;
			}

			return updated;
		});
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setTouched((prev) => ({ ...prev, [name]: true }));

		const error = validateField(name, value);
		if (error) {
			setErrors((prev) => ({ ...prev, [name]: error }));
		}
	};

	const handleFileChange = (e) => {
		const { name, files: uploadedFiles } = e.target;
		setFileErrors((prev) => ({ ...prev, [name]: "" })); // Clear previous error

		if (uploadedFiles && uploadedFiles.length > 0) {
			const file = uploadedFiles[0];

			// Validate Size (Max 2MB)
			if (file.size > CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
				setFileErrors((prev) => ({
					...prev,
					[name]: `File exceeds ${CONSTANTS.MAX_FILE_SIZE_MB}MB limit.`,
				}));
				e.target.value = ""; // Reset input
				return;
			}

			setFiles((prev) => ({ ...prev, [name]: file }));
		} else {
			setFiles((prev) => ({ ...prev, [name]: null }));
		}
	};

	const validateEntireForm = () => {
		const newErrors = {};
		let isValid = true;

		Object.keys(formData).forEach((key) => {
			// Check mandatory fields
			const mandatoryFields = [
				"firstName",
				"lastName",
				"dob",
				"gender",
				"aadhar",
				"classApplyingFor",
				"fatherName",
				"fatherMobile",
				"street",
				"city",
				"state",
				"pincode",
			];

			if (mandatoryFields.includes(key) && !formData[key]) {
				newErrors[key] = "This field is required";
				isValid = false;
			} else {
				const fieldError = validateField(key, formData[key]);
				if (fieldError) {
					newErrors[key] = fieldError;
					isValid = false;
				}
			}
		});

		setErrors(newErrors);

		// Touch all mandatory fields to show errors in UI
		const newTouched = {};
		Object.keys(newErrors).forEach((key) => (newTouched[key] = true));
		setTouched((prev) => ({ ...prev, ...newTouched }));

		return isValid;
	};

	// --- 4.5 SUBMISSION LOGIC ---
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateEntireForm()) {
			setSubmissionStatus({
				type: "error",
				message: "Please fix the highlighted errors before submitting.",
			});
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		setIsLoading(true);
		setSubmissionStatus({ type: "", message: "" });

		try {
			// Enterprise Standard: FormData for multipart/form-data
			const submissionData = new FormData();

			// Append Text Data securely
			Object.entries(formData).forEach(([key, value]) => {
				// Ensure nulls/undefined are not sent as literal "null" strings
				submissionData.append(key, value || "");
			});

			// Append File Data
			Object.entries(files).forEach(([key, file]) => {
				if (file) {
					submissionData.append(key, file);
				}
			});

			const response = await fetch(
				"/api/school/admin/students/admission",
				{
					method: "POST",
					body: submissionData,
				},
			);

			const result = await response.json();

			if (!response.ok) {
				// Handle Prisma P2002 Unique Constraints dynamically
				if (response.status === 409) {
					throw new Error(
						result.error ||
							"A record with this ID/Username already exists.",
					);
				}
				throw new Error(
					result.error || "Failed to process admission transaction.",
				);
			}

			setSubmissionStatus({
				type: "success",
				message: `🎉 Admission Complete! Student Profile created for ${result.data?.firstName || formData.firstName}. Credentials have been generated.`,
			});

			// Cleanup & Reset
			setFormData(initialFormData);
			setFiles(initialFiles);
			setErrors({});
			setTouched({});

			// Clear physical DOM file inputs
			if (formRef.current) {
				const fileInputs =
					formRef.current.querySelectorAll('input[type="file"]');
				fileInputs.forEach((input) => (input.value = ""));
			}

			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			console.error("Admission Transaction Error:", error);
			setSubmissionStatus({
				type: "error",
				message: error.message || "Internal Server Error.",
			});
			window.scrollTo({ top: 0, behavior: "smooth" });
		} finally {
			setIsLoading(false);
		}
	};

	// Calculate Form Progress
	const calculateProgress = () => {
		const sections = [
			null
			, // 0. Placeholder for 1-based indexing
			!!formData.firstName && !!formData.aadhar, // 1. Student
			!!formData.classApplyingFor, // 2. Academic
			!!formData.fatherName && !!formData.fatherMobile, // 3. Parent
			!!formData.city && !!formData.pincode, // 4. Address
			!!formData.emergencyContact, // 5. Medical
			true, // 6. Fee (Defaults exist)
			true, // 7. Bank (Optional)
			!!formData.studentUsername, // 8. Credentials
			true, // 9. Files (Optional)
		];
		const completed = sections.filter(Boolean).length;
		return Math.round((completed / sections.length) * 100);
	};

	const progress = calculateProgress();

	// ==========================================
	// 5. JSX RENDER (THE ENTERPRISE UI)
	// ==========================================
	return (
		<div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
			{/* STICKY PROGRESS BAR & HEADER */}
			<div className="max-w-7xl mx-auto mb-8 sticky top-4 z-10">
				<div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
							New Enrollment Dossier
						</h1>
						<p className="text-sm text-slate-500 font-medium mt-1">
							Anant School Standard Operating Procedure for
							Admissions
						</p>
					</div>
					<div className="w-full md:w-64">
						<div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
							<span>Form Completion</span>
							<span
								className={
									progress === 100
										? "text-emerald-600"
										: "text-indigo-600"
								}
							>
								{progress}%
							</span>
						</div>
						<div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
							<div
								className={`h-full transition-all duration-700 ease-out ${progress === 100 ? "bg-emerald-500" : "bg-indigo-600"}`}
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto">
				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className="space-y-8"
					noValidate
				>
					{/* ----------------------------------------------------
                        SECTION 1: STUDENT IDENTITY & DEMOGRAPHICS
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(1)}
					>
						<div
							className={`bg-gradient-to-r from-indigo-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 1 ? "border-l-4 border-l-indigo-600" : ""}`}
						>
							<div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
								<Icons.Student />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								1. Primary Identity & Demographics
							</h2>
						</div>

						<div className="p-6 md:p-8">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<FormInput
									label="First Name"
									name="firstName"
									required
									value={formData.firstName}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={
										touched.firstName && errors.firstName
									}
									placeholder="e.g., Aarav"
								/>
								<FormInput
									label="Middle Name"
									name="middleName"
									value={formData.middleName}
									onChange={handleInputChange}
									placeholder="e.g., Kumar"
								/>
								<FormInput
									label="Last Name"
									name="lastName"
									required
									value={formData.lastName}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.lastName && errors.lastName}
									placeholder="e.g., Sharma"
								/>
								<FormInput
									label="Student Email"
									name="studentEmail"
									type="email"
									value={formData.studentEmail}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={
										touched.studentEmail &&
										errors.studentEmail
									}
									placeholder="aarav@email.com"
									hint="Used for recovery"
								/>

								<FormSelect
									label="Gender"
									name="gender"
									required
									value={formData.gender}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.gender && errors.gender}
									options={["Male", "Female", "Other"]}
								/>
								<FormInput
									label="Date of Birth"
									name="dob"
									type="date"
									required
									value={formData.dob}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.dob && errors.dob}
								/>
								<FormSelect
									label="Blood Group"
									name="bloodGroup"
									value={formData.bloodGroup}
									onChange={handleInputChange}
									options={CONSTANTS.BLOOD_GROUPS}
								/>
								<FormSelect
									label="Nationality"
									name="nationality"
									value={formData.nationality}
									onChange={handleInputChange}
									options={[
										"Indian",
										"NRI",
										"Foreign National",
									]}
								/>

								<FormSelect
									label="Religion"
									name="religion"
									required
									value={formData.religion}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.religion && errors.religion}
									options={CONSTANTS.RELIGIONS}
								/>
								<FormSelect
									label="Category (Caste)"
									name="category"
									required
									value={formData.category}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.category && errors.category}
									options={CONSTANTS.CATEGORIES}
								/>
								<FormSelect
									label="Staff Child"
									name="isStaffChild"
									value={formData.isStaffChild}
									onChange={handleInputChange}
									options={["No", "Yes"]}
									hint="Is parent a school employee?"
								/>
								<FormInput
									label="Admission Date"
									name="admissionDate"
									type="date"
									required
									value={formData.admissionDate}
									onChange={handleInputChange}
								/>

								<FormInput
									label="Aadhar Number"
									name="aadhar"
									required
									value={formData.aadhar}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.aadhar && errors.aadhar}
									placeholder="123456789012"
									hint="12-digit unique ID"
								/>
								<FormInput
									label="Samagra ID"
									name="samagraId"
									value={formData.samagraId}
									onChange={handleInputChange}
									placeholder="For MP State Boards"
								/>
								<FormInput
									label="ABC ID"
									name="abcId"
									value={formData.abcId}
									onChange={handleInputChange}
									placeholder="Academic Bank of Credits"
								/>
								<FormInput
									label="Identification Mark"
									name="identificationMark"
									value={formData.identificationMark}
									onChange={handleInputChange}
									placeholder="e.g., Mole on left cheek"
								/>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 2: ACADEMIC HISTORY
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(2)}
					>
						<div
							className={`bg-gradient-to-r from-blue-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 2 ? "border-l-4 border-l-blue-600" : ""}`}
						>
							<div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
								<Icons.Book />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								2. Academic Enrollment Details
							</h2>
						</div>

						<div className="p-6 md:p-8">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="lg:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormSelect
										label="Applying For Class"
										name="classApplyingFor"
										required
										value={formData.classApplyingFor}
										onChange={handleInputChange}
										onBlur={handleBlur}
										error={
											touched.classApplyingFor &&
											errors.classApplyingFor
										}
										options={CONSTANTS.CLASSES}
									/>
									<FormSelect
										label="Assign Section"
										name="section"
										value={formData.section}
										onChange={handleInputChange}
										options={CONSTANTS.SECTIONS}
										hint="Can be assigned later by Admin"
									/>
								</div>
								<div className="lg:col-span-2 p-4 bg-slate-50/50 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormSelect
										label="Previous Class"
										name="previousClass"
										value={formData.previousClass}
										onChange={handleInputChange}
										options={[
											{
												value: "new",
												label: "-- First Time Admission --",
											},
											...CONSTANTS.CLASSES,
										]}
									/>
									<FormInput
										label="Previous School Name"
										name="previousSchool"
										value={formData.previousSchool}
										onChange={handleInputChange}
										placeholder="e.g., Delhi Public School"
									/>
								</div>

								<FormInput
									label="Transfer Certificate (TC) No."
									name="tcNumber"
									value={formData.tcNumber}
									onChange={handleInputChange}
									placeholder="Optional"
								/>
								<FormInput
									label="Previous UDISE Code"
									name="previousUdiseCode"
									value={formData.previousUdiseCode}
									onChange={handleInputChange}
									placeholder="11 digit code"
								/>
								<FormSelect
									label="Instruction Medium"
									name="previousMediumOfInstruction"
									value={formData.previousMediumOfInstruction}
									onChange={handleInputChange}
									options={["English", "Hindi", "Regional"]}
								/>
								<FormInput
									label="Board Reg Number"
									name="boardRegistrationNumber"
									value={formData.boardRegistrationNumber}
									onChange={handleInputChange}
									placeholder="If shifting within same board"
								/>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 3: FAMILY & GUARDIAN
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(3)}
					>
						<div
							className={`bg-gradient-to-r from-fuchsia-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 3 ? "border-l-4 border-l-fuchsia-600" : ""}`}
						>
							<div className="p-2 bg-fuchsia-100 text-fuchsia-700 rounded-lg">
								<Icons.Family />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								3. Family & Custody Information
							</h2>
						</div>

						<div className="p-6 md:p-8 space-y-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
								<FormSelect
									label="Parents Marital Status"
									name="parentsMaritalStatus"
									value={formData.parentsMaritalStatus}
									onChange={handleInputChange}
									options={[
										"Married",
										"Single",
										"Divorced",
										"Widowed",
									]}
								/>
								<FormSelect
									label="Legal Custody Held By"
									name="legalCustodyHolder"
									value={formData.legalCustodyHolder}
									onChange={handleInputChange}
									options={[
										"Both Parents",
										"Father Only",
										"Mother Only",
										"Legal Guardian",
									]}
									hint="Determines who receives official school notices"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* FATHER PANEL */}
								<div className="space-y-5 p-5 bg-white rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
									<div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
									<h3 className="font-extrabold text-slate-700 uppercase tracking-wide text-sm flex items-center gap-2">
										Father's Details
									</h3>
									<div className="grid grid-cols-1 gap-4">
										<FormInput
											label="Father's Full Name"
											name="fatherName"
											required
											value={formData.fatherName}
											onChange={handleInputChange}
											onBlur={handleBlur}
											error={
												touched.fatherName &&
												errors.fatherName
											}
											placeholder="As per legal docs"
										/>
										<FormInput
											label="Mobile Number"
											name="fatherMobile"
											type="tel"
											required
											value={formData.fatherMobile}
											onChange={handleInputChange}
											onBlur={handleBlur}
											error={
												touched.fatherMobile &&
												errors.fatherMobile
											}
											placeholder="10 digits"
											hint="This becomes the Parent Portal Login ID"
										/>
										<FormInput
											label="Date of Birth"
											name="fatherDob"
											type="date"
											value={formData.fatherDob}
											onChange={handleInputChange}
											hint="This becomes the Default Password"
										/>
										<div className="grid grid-cols-2 gap-4">
											<FormInput
												label="Occupation"
												name="fatherOccupation"
												value={
													formData.fatherOccupation
												}
												onChange={handleInputChange}
												placeholder="e.g., Engineer"
											/>
											<FormInput
												label="Annual Income"
												name="fatherIncome"
												type="number"
												value={formData.fatherIncome}
												onChange={handleInputChange}
												placeholder="₹ Amount"
											/>
										</div>
										<FormInput
											label="Personal Email"
											name="fatherEmail"
											type="email"
											value={formData.fatherEmail}
											onChange={handleInputChange}
											onBlur={handleBlur}
											error={
												touched.fatherEmail &&
												errors.fatherEmail
											}
											placeholder="mail@example.com"
										/>
									</div>
								</div>

								{/* MOTHER PANEL */}
								<div className="space-y-5 p-5 bg-white rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
									<div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
									<h3 className="font-extrabold text-slate-700 uppercase tracking-wide text-sm flex items-center gap-2">
										Mother's Details
									</h3>
									<div className="grid grid-cols-1 gap-4">
										<FormInput
											label="Mother's Full Name"
											name="motherName"
											required
											value={formData.motherName}
											onChange={handleInputChange}
											onBlur={handleBlur}
											error={
												touched.motherName &&
												errors.motherName
											}
											placeholder="As per legal docs"
										/>
										<FormInput
											label="Mobile Number"
											name="motherMobile"
											type="tel"
											value={formData.motherMobile}
											onChange={handleInputChange}
											onBlur={handleBlur}
											error={
												touched.motherMobile &&
												errors.motherMobile
											}
											placeholder="10 digits"
										/>
										<FormInput
											label="Date of Birth"
											name="motherDob"
											type="date"
											value={formData.motherDob}
											onChange={handleInputChange}
										/>
										<div className="grid grid-cols-2 gap-4">
											<FormInput
												label="Occupation"
												name="motherOccupation"
												value={
													formData.motherOccupation
												}
												onChange={handleInputChange}
												placeholder="e.g., Doctor"
											/>
											<FormInput
												label="Personal Email"
												name="motherEmail"
												type="email"
												value={formData.motherEmail}
												onChange={handleInputChange}
												onBlur={handleBlur}
												error={
													touched.motherEmail &&
													errors.motherEmail
												}
												placeholder="mail@example.com"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* SIBLINGS */}
							<div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormSelect
										label="Any Siblings Studying Here?"
										name="siblingStudyingHere"
										value={formData.siblingStudyingHere}
										onChange={handleInputChange}
										options={["No", "Yes"]}
									/>
									{formData.siblingStudyingHere === "Yes" && (
										<FormInput
											label="Sibling Details (Name & Class)"
											name="siblingDetails"
											value={formData.siblingDetails}
											onChange={handleInputChange}
											placeholder="e.g., Rohit Sharma - Class 9A"
											hint="Used for applying Sibling Discounts"
										/>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 4: GEOGRAPHICAL ADDRESS
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(4)}
					>
						<div
							className={`bg-gradient-to-r from-emerald-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 4 ? "border-l-4 border-l-emerald-600" : ""}`}
						>
							<div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
								<Icons.Home />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								4. Residential Address
							</h2>
						</div>

						<div className="p-6 md:p-8">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<FormInput
									label="House / Flat No."
									name="houseNo"
									value={formData.houseNo}
									onChange={handleInputChange}
									placeholder="e.g., Apt 402"
								/>
								<div className="md:col-span-2">
									<FormInput
										label="Street / Locality"
										name="street"
										required
										value={formData.street}
										onChange={handleInputChange}
										onBlur={handleBlur}
										error={touched.street && errors.street}
										placeholder="e.g., Sector 15, Main Market Road"
									/>
								</div>
								<FormInput
									label="City / Village"
									name="city"
									required
									value={formData.city}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.city && errors.city}
									placeholder="e.g., Bhopal"
								/>
								<FormInput
									label="District"
									name="district"
									required
									value={formData.district}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.district && errors.district}
									placeholder="e.g., Bhopal"
								/>
								<FormSelect
									label="State"
									name="state"
									required
									value={formData.state}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.state && errors.state}
									options={CONSTANTS.STATES}
								/>
								<FormInput
									label="Pincode / ZIP"
									name="pincode"
									type="number"
									required
									value={formData.pincode}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={touched.pincode && errors.pincode}
									placeholder="6 digit code"
								/>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 5: MEDICAL & EMERGENCY
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(5)}
					>
						<div
							className={`bg-gradient-to-r from-red-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 5 ? "border-l-4 border-l-red-600" : ""}`}
						>
							<div className="p-2 bg-red-100 text-red-700 rounded-lg">
								<Icons.Medical />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								5. Medical & Emergency Protocol
							</h2>
						</div>

						<div className="p-6 md:p-8">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
								<FormInput
									label="Emergency Contact Name"
									name="emergencyContact"
									required
									value={formData.emergencyContact}
									onChange={handleInputChange}
									placeholder="Local Guardian / Relative"
								/>
								<FormInput
									label="Emergency Phone"
									name="emergencyMobile"
									type="tel"
									required
									value={formData.emergencyMobile}
									onChange={handleInputChange}
									onBlur={handleBlur}
									error={
										touched.emergencyMobile &&
										errors.emergencyMobile
									}
									placeholder="10 digits"
								/>
								<FormInput
									label="Relation with Student"
									name="emergencyRelation"
									required
									value={formData.emergencyRelation}
									onChange={handleInputChange}
									placeholder="e.g., Uncle, Grandfather"
								/>
							</div>

							<div className="bg-red-50/50 p-5 rounded-xl border border-red-100 grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="md:col-span-3">
									<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
										Known Medical Conditions / History
									</label>
									<textarea
										name="medicalConditions"
										value={formData.medicalConditions}
										onChange={handleInputChange}
										rows={2}
										placeholder="List chronic illnesses, asthma, diabetes, etc."
										className="w-full rounded-lg border-slate-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none border"
									/>
								</div>
								<FormInput
									label="Specific Allergies"
									name="allergies"
									value={formData.allergies}
									onChange={handleInputChange}
									placeholder="e.g., Peanuts, Penicillin"
									hint="Critical for cafeteria staff"
								/>
								<FormInput
									label="Family Doctor Name"
									name="familyDoctorName"
									value={formData.familyDoctorName}
									onChange={handleInputChange}
									placeholder="Dr. Name"
								/>
								<FormInput
									label="Preferred Hospital"
									name="preferredHospital"
									value={formData.preferredHospital}
									onChange={handleInputChange}
									placeholder="For serious emergencies"
								/>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 6: FEE & FINANCIALS
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(6)}
					>
						<div
							className={`bg-gradient-to-r from-amber-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 6 ? "border-l-4 border-l-amber-600" : ""}`}
						>
							<div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
								<Icons.Money />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								6. Fee Configuration
							</h2>
						</div>

						<div className="p-6 md:p-8">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
								<FormSelect
									label="Fee Category Profile"
									name="feeCategory"
									value={formData.feeCategory}
									onChange={handleInputChange}
									options={[
										"General",
										"Staff Discount",
										"Sibling Discount",
										"EWS",
										"Sports Quota",
									]}
								/>
								<FormSelect
									label="Scholarship Approved?"
									name="scholarship"
									value={formData.scholarship}
									onChange={handleInputChange}
									options={["No", "Yes"]}
								/>
								<div className="md:col-span-2">
									<FormInput
										label="Concession Remarks / Approval Ref"
										name="concessionDetails"
										value={formData.concessionDetails}
										onChange={handleInputChange}
										placeholder="e.g., Approved by Principal on 12/Oct"
									/>
								</div>

								<FormInput
									label="Admission Fee Paid"
									name="admissionFeePaid"
									type="number"
									value={formData.admissionFeePaid}
									onChange={handleInputChange}
									placeholder="₹ Amount"
								/>
								<FormInput
									label="Transport Fee Paid"
									name="transportFeePaid"
									type="number"
									value={formData.transportFeePaid}
									onChange={handleInputChange}
									placeholder="₹ Amount"
								/>
								<FormInput
									label="Security Deposit"
									name="securityDepositPaid"
									type="number"
									value={formData.securityDepositPaid}
									onChange={handleInputChange}
									placeholder="₹ Amount"
								/>

								<FormSelect
									label="Tuition Cycle"
									name="tuitionFeeCycle"
									value={formData.tuitionFeeCycle}
									onChange={handleInputChange}
									options={CONSTANTS.FEE_CYCLES}
								/>
								<FormSelect
									label="Payment Mode"
									name="paymentMode"
									value={formData.paymentMode}
									onChange={handleInputChange}
									options={CONSTANTS.PAYMENT_MODES}
								/>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 7: BANKING (Optional)
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(7)}
					>
						<div
							className={`bg-gradient-to-r from-teal-50 to-white p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeSection === 7 ? "border-l-4 border-l-teal-600" : ""}`}
						>
							<div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
								<Icons.Bank />
							</div>
							<h2 className="text-xl font-bold text-slate-800">
								7. Bank Details (For DBTs/Refunds)
							</h2>
						</div>

						<div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
							<FormInput
								label="Bank Name"
								name="bankName"
								value={formData.bankName}
								onChange={handleInputChange}
								placeholder="e.g., State Bank of India"
							/>
							<FormInput
								label="Account Number"
								name="accountNumber"
								value={formData.accountNumber}
								onChange={handleInputChange}
								placeholder="Student or Parent A/c"
							/>
							<FormInput
								label="IFSC Code"
								name="ifscCode"
								value={formData.ifscCode}
								onChange={handleInputChange}
								onBlur={handleBlur}
								error={touched.ifscCode && errors.ifscCode}
								placeholder="SBIN0001234"
							/>
							<FormInput
								label="Branch Name"
								name="branchNameAndCode"
								value={formData.branchNameAndCode}
								onChange={handleInputChange}
								placeholder="e.g., MG Road Branch"
							/>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 8: PORTAL CREDENTIALS
                    ------------------------------------------------------*/}
					<div
						className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden text-slate-100"
						onMouseEnter={() => setActiveSection(8)}
					>
						<div className="bg-slate-900 p-5 border-b border-slate-700 flex items-center gap-3">
							<div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
								<Icons.Key />
							</div>
							<div>
								<h2 className="text-xl font-bold text-white">
									8. Anant School Ecosystem Logins
								</h2>
								<p className="text-xs text-slate-400 mt-1">
									Our engine has auto-generated secure
									credentials. You may override them below.
								</p>
							</div>
						</div>

						<div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="bg-slate-100 p-5 rounded-xl border border-slate-400 shadow-inner">
								<h3 className="font-bold text-indigo-400 mb-4 flex items-center gap-2">
									<Icons.Student /> Student LMS Access
								</h3>
								<div className="space-y-4 text-black font-mono">
									<FormInput
										label="Username"
										name="studentUsername"
										value={formData.studentUsername}
										onChange={handleInputChange}
									/>
									<FormInput
										label="Initial Password"
										name="studentPassword"
										value={formData.studentPassword}
										onChange={handleInputChange}
										hint="Force change on first login"
									/>
								</div>
							</div>
							<div className="bg-slate-100 p-5 rounded-xl border border-slate-600 shadow-inner">
								<h3 className="font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
									<Icons.Family /> Parent Portal Access
								</h3>
								<div className="space-y-4 text-black font-mono">
									<FormInput
										label="Username"
										name="fatherUsername"
										value={formData.fatherUsername}
										onChange={handleInputChange}
									/>
									<FormInput
										label="Initial Password"
										name="fatherPassword"
										value={formData.fatherPassword}
										onChange={handleInputChange}
										hint="Force change on first login"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* ----------------------------------------------------
                        SECTION 9: DIGITAL LOCKER (UPLOADS)
                    ------------------------------------------------------*/}
					<div
						className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
						onMouseEnter={() => setActiveSection(9)}
					>
						<div
							className={`bg-gradient-to-r from-orange-50 to-white p-5 border-b border-slate-100 flex items-center justify-between transition-colors ${activeSection === 9 ? "border-l-4 border-l-orange-600" : ""}`}
						>
							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
									<Icons.Upload />
								</div>
								<div>
									<h2 className="text-xl font-bold text-slate-800">
										9. Document Archive
									</h2>
									<p className="text-xs text-slate-500 font-medium mt-1">
										Upload verified digital copies. Max
										size: 2MB per file.
									</p>
								</div>
							</div>
						</div>

						<div className="p-6 md:p-8">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<FormFile
									label="Student Passport Photo"
									name="studentPhoto"
									accept="image/jpeg, image/png"
									onChange={handleFileChange}
									error={fileErrors.studentPhoto}
									fileData={files.studentPhoto}
									hint="Strictly professional photo with plain background"
								/>
								<FormFile
									label="Birth Certificate"
									name="studentBirthCertificate"
									onChange={handleFileChange}
									error={fileErrors.studentBirthCertificate}
									fileData={files.studentBirthCertificate}
								/>
								<FormFile
									label="Student Aadhar Card"
									name="studentAadhar"
									onChange={handleFileChange}
									error={fileErrors.studentAadhar}
									fileData={files.studentAadhar}
								/>

								<FormFile
									label="Father's Aadhar Card"
									name="fatherAadhar"
									onChange={handleFileChange}
									error={fileErrors.fatherAadhar}
									fileData={files.fatherAadhar}
								/>
								<FormFile
									label="Mother's Aadhar Card"
									name="motherAadhar"
									onChange={handleFileChange}
									error={fileErrors.motherAadhar}
									fileData={files.motherAadhar}
								/>
								<FormFile
									label="Previous Marksheet"
									name="previousMarksheet"
									onChange={handleFileChange}
									error={fileErrors.previousMarksheet}
									fileData={files.previousMarksheet}
								/>

								<FormFile
									label="Transfer Certificate (TC)"
									name="studentTc"
									onChange={handleFileChange}
									error={fileErrors.studentTc}
									fileData={files.studentTc}
								/>
								<FormFile
									label="Caste Certificate"
									name="studentCasteCertificate"
									onChange={handleFileChange}
									error={fileErrors.studentCasteCertificate}
									fileData={files.studentCasteCertificate}
									hint="Required if not General category"
								/>
								<FormFile
									label="Family ID Document"
									name="familyId"
									onChange={handleFileChange}
									error={fileErrors.familyId}
									fileData={files.familyId}
								/>

								<FormFile
									label="Income Certificate"
									name="incomeCertificate"
									onChange={handleFileChange}
									error={fileErrors.incomeCertificate}
									fileData={files.incomeCertificate}
									hint="For fee concessions"
								/>
								<FormFile
									label="BPL Ration Card"
									name="bplCertificate"
									onChange={handleFileChange}
									error={fileErrors.bplCertificate}
									fileData={files.bplCertificate}
								/>
								<FormFile
									label="Parent Domicile"
									name="domicileCertificate"
									onChange={handleFileChange}
									error={fileErrors.domicileCertificate}
									fileData={files.domicileCertificate}
								/>
							</div>
						</div>
					</div>

					{/* STATUS MESSAGES */}
					{submissionStatus.message && (
						<div
							className={`mb-8 p-5 rounded-2xl shadow-sm flex items-start gap-3 border ${
								submissionStatus.type === "success"
									? "bg-emerald-50 border-emerald-200 text-emerald-800"
									: "bg-red-50 border-red-200 text-red-800"
							}`}
						>
							<div className="mt-0.5">
								{submissionStatus.type === "success" ? (
									<Icons.Check />
								) : (
									<Icons.Alert />
								)}
							</div>
							<div>
								<h3 className="font-bold text-lg">
									{submissionStatus.type === "success"
										? "Registration Successful"
										: "Action Required"}
								</h3>
								<p className="text-sm font-medium mt-1">
									{submissionStatus.message}
								</p>
							</div>
						</div>
					)}

					{/* ----------------------------------------------------
                        SUBMIT ACTION BAR
                    ------------------------------------------------------*/}
					<div className="sticky bottom-4 z-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="text-sm font-medium text-slate-500 flex items-center gap-2">
							<Icons.Check /> Please review all 9 sections before
							submission.
						</div>
						<button
							type="submit"
							disabled={isLoading}
							className={`w-full md:w-auto flex items-center justify-center gap-2 py-4 px-10 rounded-xl shadow-lg text-base font-bold text-white transition-all transform active:scale-[0.98]
                                ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5"}
                            `}
						>
							{isLoading ? (
								<>
									<span className="animate-spin text-xl">
										↻
									</span>{" "}
									Processing Transaction...
								</>
							) : (
								"Complete Registration & Commit to Database"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

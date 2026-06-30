"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
	Plus,
	LayoutGrid,
	Loader2,
	Trash2,
	Edit,
	AlertCircle,
	CheckCircle,
	X,
	Search,
	Filter,
	IndianRupee,
	ShieldAlert,
	Info,
} from "lucide-react";

// ==========================================
// 1. CONSTANTS
// ==========================================

const YEARS = [
	{ value: "2026-2027", label: "2026-2027" },
	{ value: "2027-2028", label: "2027-2028" },
];

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

// ==========================================
// 2. REUSABLE UI COMPONENTS
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
	hint,
	prefix,
}) => (
	<div className="flex flex-col space-y-1 w-full relative">
		<label
			htmlFor={name}
			className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
		>
			{label}{" "}
			{required && <span className="text-red-500 text-sm">*</span>}
		</label>
		<div className="relative flex items-center">
			{prefix && (
				<span className="absolute left-3 text-slate-400 font-medium">
					{prefix}
				</span>
			)}
			<input
				id={name}
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				className={`block w-full rounded-lg shadow-sm text-sm p-3 transition-all duration-200 border outline-none
                    ${prefix ? "pl-8" : ""}
                    ${error ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200" : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
                `}
			/>
		</div>
		{hint && !error && (
			<p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
				<Info className="w-3 h-3" /> {hint}
			</p>
		)}
		{error && (
			<p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
				<AlertCircle className="w-3 h-3" /> {error}
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
                ${error ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200" : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
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
				<Info className="w-3 h-3" /> {hint}
			</p>
		)}
		{error && (
			<p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
				<AlertCircle className="w-3 h-3" /> {error}
			</p>
		)}
	</div>
);

const Modal = ({
	isOpen,
	onClose,
	title,
	message,
	onConfirm,
	isDestructive,
}) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
				<div className="p-6">
					<div
						className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}
					>
						{isDestructive ? (
							<ShieldAlert className="w-6 h-6" />
						) : (
							<AlertCircle className="w-6 h-6" />
						)}
					</div>
					<h3 className="text-xl font-bold text-slate-900 mb-2">
						{title}
					</h3>
					<p className="text-slate-500 text-sm leading-relaxed">
						{message}
					</p>
				</div>
				<div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
					<button
						onClick={onClose}
						className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors shadow-sm ${isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

const SkeletonCard = () => (
	<div className="bg-white rounded-3xl border border-slate-200 p-7 animate-pulse">
		<div className="flex justify-between items-start mb-6">
			<div className="space-y-3 w-1/2">
				<div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
				<div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
			</div>
			<div className="h-10 bg-slate-200 rounded-md w-1/4"></div>
		</div>
		<div className="grid grid-cols-2 gap-4">
			{[1, 2, 3, 4].map((i) => (
				<div key={i} className="space-y-2">
					<div className="h-3 bg-slate-100 rounded w-1/2"></div>
					<div className="h-5 bg-slate-200 rounded w-3/4"></div>
				</div>
			))}
		</div>
	</div>
);

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function PremiumFeeStructurePage() {
	const initialFormState = {
		className: "",
		academicYear: "2026-2027",
		tuitionFee: "",
		libraryFee: "",
		transportFee: "",
		activityFee: "",
	};

	const [feeStructures, setFeeStructures] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState(null);
	const [activeTab, setActiveTab] = useState("view");
	const [editingId, setEditingId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
	const [formData, setFormData] = useState(initialFormState);
	const [formErrors, setFormErrors] = useState({});

	const fetchFeeStructures = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/school/finance/feeStructure");
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			setFeeStructures(data);
		} catch (error) {
			showToast("error", "Failed to fetch fee structures.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchFeeStructures();
	}, [fetchFeeStructures]);

	const liveTotal = useMemo(() => {
		return [
			"tuitionFee",
			"libraryFee",
			"transportFee",
			"activityFee",
		].reduce((sum, key) => sum + (parseFloat(formData[key]) || 0), 0);
	}, [formData]);

	const filteredStructures = useMemo(() => {
		return feeStructures.filter(
			(fee) =>
				fee.className
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				fee.academicYear.includes(searchQuery),
		);
	}, [feeStructures, searchQuery]);

	const showToast = (type, message) => {
		setNotification({ type, message });
		setTimeout(() => setNotification(null), 4000);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (formErrors[name])
			setFormErrors((prev) => ({ ...prev, [name]: null }));
	};

	const validateForm = () => {
		const errors = {};
		if (!formData.className.trim())
			errors.className = "Class name is required";
		if (parseFloat(formData.tuitionFee) <= 0 || !formData.tuitionFee)
			errors.tuitionFee = "Tuition fee must be greater than 0";
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm())
			return showToast("error", "Please fix the errors in the form.");

		setIsSubmitting(true);
		const payload = {
			className: formData.className,
			academicYear: formData.academicYear,
			tuitionFee: parseFloat(formData.tuitionFee) || 0,
			libraryFee: parseFloat(formData.libraryFee) || 0,
			transportFee: parseFloat(formData.transportFee) || 0,
			activityFee: parseFloat(formData.activityFee) || 0,
		};

		try {
			const url = editingId
				? `/api/school/finance/feeStructure/${editingId}`
				: "/api/school/finance/feeStructure";
			const method = editingId ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error("API Error");
			const savedData = await response.json();

			setFeeStructures((prev) =>
				editingId
					? prev.map((f) => (f.id === editingId ? savedData : f))
					: [savedData, ...prev],
			);
			showToast(
				"success",
				`Blueprint successfully ${editingId ? "updated" : "created"}!`,
			);
			resetForm();
		} catch (error) {
			showToast("error", "Operation failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		try {
			const response = await fetch(
				`/api/school/finance/feeStructure/${deleteModal.id}`,
				{ method: "DELETE" },
			);
			if (!response.ok) throw new Error("Delete failed");

			setFeeStructures((prev) =>
				prev.filter((f) => f.id !== deleteModal.id),
			);
			showToast("success", "Blueprint deleted permanently.");
		} catch (error) {
			showToast("error", "Failed to delete blueprint.");
		} finally {
			setDeleteModal({ isOpen: false, id: null });
		}
	};

	const resetForm = () => {
		setFormData(initialFormState);
		setEditingId(null);
		setFormErrors({});
		setActiveTab("view");
	};

	const formatCurrency = (amount) =>
		new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);

	return (
		<div className="p-6 md:p-10 bg-slate-50/50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
			{notification && (
				<div
					className={`fixed top-6 right-6 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 z-50 animate-in slide-in-from-top-4 fade-in duration-300 ${notification.type === "success" ? "bg-white border-emerald-100 text-slate-800" : "bg-red-50 border-red-100 text-red-900"}`}
				>
					{notification.type === "success" ? (
						<CheckCircle className="w-5 h-5 text-emerald-500" />
					) : (
						<AlertCircle className="w-5 h-5 text-red-500" />
					)}
					<p className="text-sm font-bold tracking-tight">
						{notification.message}
					</p>
				</div>
			)}

			<Modal
				isOpen={deleteModal.isOpen}
				onClose={() => setDeleteModal({ isOpen: false, id: null })}
				onConfirm={confirmDelete}
				title="Delete Blueprint?"
				message="This action cannot be undone. This will permanently delete the fee structure from your database."
				isDestructive={true}
			/>

			<div className="max-w-7xl mx-auto space-y-8">
				<header className="flex flex-col md:flex-row md:items-end justify-between gap-5">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
								<IndianRupee className="w-5 h-5" />
							</div>
							<h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
								Fee Master
							</h1>
						</div>
						<p className="text-slate-500 text-sm md:text-base font-medium">
							Design and manage multi-tenant financial blueprints
							for School Grid.
						</p>
					</div>

					{activeTab === "view" && (
						<div className="relative w-full md:w-80 group">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
							<input
								type="text"
								placeholder="Search class or year..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
							/>
						</div>
					)}
				</header>

				<div className="flex space-x-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
					<button
						onClick={() => {
							setActiveTab("view");
							setEditingId(null);
						}}
						className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === "view" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"}`}
					>
						<LayoutGrid className="w-4 h-4" /> Active Blueprints
					</button>
					<button
						onClick={() => {
							setActiveTab("form");
							setFormData(initialFormState);
							setEditingId(null);
						}}
						className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === "form" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"}`}
					>
						{editingId ? (
							<Edit className="w-4 h-4" />
						) : (
							<Plus className="w-4 h-4" />
						)}{" "}
						{editingId ? "Edit Blueprint" : "New Blueprint"}
					</button>
				</div>

				<main>
					{activeTab === "view" && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
							{isLoading ? (
								<>
									<SkeletonCard /> <SkeletonCard />{" "}
									<SkeletonCard />
								</>
							) : filteredStructures.length === 0 ? (
								<div className="col-span-full flex flex-col items-center justify-center py-32 bg-white border border-slate-200 rounded-3xl border-dashed">
									<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
										<Filter className="w-8 h-8 text-slate-300" />
									</div>
									<h3 className="text-lg font-bold text-slate-900 mb-1">
										No structures found
									</h3>
									<p className="text-slate-500 font-medium text-sm mb-6">
										Create a new fee blueprint to get
										started.
									</p>
									<button
										onClick={() => setActiveTab("form")}
										className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
									>
										<Plus className="w-4 h-4" /> Create
										First Blueprint
									</button>
								</div>
							) : (
								filteredStructures.map((fee) => (
									<div
										key={fee.id}
										className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300 group flex flex-col"
									>
										<div className="bg-slate-900 p-6 text-white relative overflow-hidden">
											<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
											<span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider mb-3 backdrop-blur-md border border-white/10">
												<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{" "}
												{fee.academicYear}
											</span>
											<h2 className="text-2xl font-black tracking-tight truncate pr-4">
												{fee.className}
											</h2>
										</div>

										<div className="p-6 flex-grow flex flex-col justify-between">
											<div className="space-y-4 mb-6">
												<div className="flex justify-between items-center pb-3 border-b border-slate-100">
													<span className="text-slate-500 text-sm font-semibold">
														Tuition
													</span>
													<span className="text-slate-900 font-bold">
														{formatCurrency(
															fee.tuitionFee,
														)}
													</span>
												</div>
												<div className="flex justify-between items-center pb-3 border-b border-slate-100">
													<span className="text-slate-500 text-sm font-semibold">
														Library & Lab
													</span>
													<span className="text-slate-900 font-bold">
														{formatCurrency(
															fee.libraryFee,
														)}
													</span>
												</div>
												<div className="flex justify-between items-center pb-3 border-b border-slate-100">
													<span className="text-slate-500 text-sm font-semibold">
														Transport
													</span>
													<span className="text-slate-900 font-bold">
														{formatCurrency(
															fee.transportFee,
														)}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="text-slate-500 text-sm font-semibold">
														Activity
													</span>
													<span className="text-slate-900 font-bold">
														{formatCurrency(
															fee.activityFee,
														)}
													</span>
												</div>
											</div>

											<div className="pt-4 border-t border-slate-200 mt-auto">
												<div className="flex justify-between items-end mb-5">
													<span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
														Total
													</span>
													<span className="text-2xl font-black text-indigo-600">
														{formatCurrency(
															fee.tuitionFee +
																fee.libraryFee +
																fee.transportFee +
																fee.activityFee,
														)}
													</span>
												</div>
												<div className="flex gap-2">
													<button
														onClick={() => {
															setFormData(fee);
															setEditingId(
																fee.id,
															);
															setActiveTab(
																"form",
															);
														}}
														className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 border border-slate-200 transition-colors"
													>
														<Edit className="w-4 h-4" />{" "}
														Edit
													</button>
													<button
														onClick={() =>
															setDeleteModal({
																isOpen: true,
																id: fee.id,
															})
														}
														className="p-2.5 flex items-center justify-center bg-white text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					)}

					{activeTab === "form" && (
						<div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500 relative">
							{editingId && (
								<button
									onClick={resetForm}
									className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							)}

							<div className="p-8 md:p-12">
								<div className="mb-10">
									<h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
										{editingId
											? "Modify Blueprint"
											: "Configure New Blueprint"}
									</h2>
									<p className="text-slate-500 font-medium">
										Set the financial parameters for the
										specific academic class below.
									</p>
								</div>

								<form
									onSubmit={handleSubmit}
									className="space-y-10"
								>
									<div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-6">
										<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
											<span className="w-2 h-2 rounded-full bg-indigo-400"></span>{" "}
											Academic Mapping
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<FormSelect
												label="Class"
												name="className"
												value={formData.className}
												onChange={handleInputChange}
												options={CLASSES}
												required
												error={formErrors.className}
											/>
											<FormSelect
												label="Academic Year"
												name="academicYear"
												value={formData.academicYear}
												onChange={handleInputChange}
												options={YEARS}
												required
											/>
										</div>
									</div>

									<div className="bg-white space-y-6 px-2">
										<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
											<span className="w-2 h-2 rounded-full bg-emerald-400"></span>{" "}
											Cost Breakdown (INR)
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
											<FormInput
												type="number"
												label="Annual Tuition Fee"
												name="tuitionFee"
												value={formData.tuitionFee}
												onChange={handleInputChange}
												prefix="₹"
												placeholder="0"
												min="0"
												error={formErrors.tuitionFee}
												required
											/>
											<FormInput
												type="number"
												label="Library & Lab Fee"
												name="libraryFee"
												value={formData.libraryFee}
												onChange={handleInputChange}
												prefix="₹"
												placeholder="0"
												min="0"
											/>
											<FormInput
												type="number"
												label="Transport Fee"
												name="transportFee"
												value={formData.transportFee}
												onChange={handleInputChange}
												prefix="₹"
												placeholder="0"
												min="0"
											/>
											<FormInput
												type="number"
												label="Activity & Extra Fee"
												name="activityFee"
												value={formData.activityFee}
												onChange={handleInputChange}
												prefix="₹"
												placeholder="0"
												min="0"
											/>
										</div>
									</div>

									<div className="bg-slate-900 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-slate-900/10 mt-12">
										<div>
											<p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">
												Calculated Total
											</p>
											<p className="text-4xl font-black text-white tracking-tight">
												{formatCurrency(liveTotal)}
											</p>
										</div>

										<div className="flex gap-3 w-full md:w-auto">
											{editingId && (
												<button
													type="button"
													onClick={resetForm}
													className="w-full md:w-auto bg-slate-800 text-slate-300 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-700 transition-all"
												>
													Cancel
												</button>
											)}
											<button
												type="submit"
												disabled={isSubmitting}
												className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-indigo-400 active:scale-95 disabled:opacity-70 transition-all"
											>
												{isSubmitting ? (
													<>
														<Loader2 className="w-5 h-5 animate-spin" />{" "}
														{editingId
															? "Saving..."
															: "Publishing..."}
													</>
												) : editingId ? (
													"Update Blueprint"
												) : (
													"Publish Blueprint"
												)}
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

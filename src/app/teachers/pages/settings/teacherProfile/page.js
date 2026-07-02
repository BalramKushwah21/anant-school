"use client";

import React, { useState, useEffect } from "react";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Award,
	Lock,
	Eye,
	EyeOff,
	Save,
	Edit2,
	ShieldCheck,
	Camera,
	Loader2,
} from "lucide-react";

export default function TeacherProfile() {
	// Master Profile State (Initially null to show loading screen)
	const [profile, setProfile] = useState(null);

	// Password mutation local states
	const [passwords, setPasswords] = useState({
		current: "",
		next: "",
		confirm: "",
	});
	const [showPass, setShowPass] = useState({
		current: false,
		next: false,
		confirm: false,
	});

	// Layout interaction states
	const [isEditing, setIsEditing] = useState(false);
	const [showToast, setShowToast] = useState({
		show: false,
		message: "",
		type: "success",
	});
	const [isLoading, setIsLoading] = useState(true);

	// ==========================================
	// 1. FETCH DATA FROM DATABASE ON MOUNT
	// ==========================================
	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await fetch("/api/school/teacher/profile");
				if (response.ok) {
					const data = await response.json();
					// Backend se aaye data ko state mein set karein
					setProfile({
						...data,
						// Fallbacks in case any field is empty in DB
						alternateMobile: data.alternateMobile || "",
						address: data.address || "",
						city: data.city || "",
						pincode: data.pincode || "",
					});
				} else {
					triggerToast(
						"Failed to load profile data from server.",
						"error",
					);
				}
			} catch (error) {
				console.error("Fetch error:", error);
				triggerToast("Network error. Please try again.", "error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfileData();
	}, []);

	// ==========================================
	// 4. UPLOAD PHOTO TO VPS & SAVE URL TO DB
	// ==========================================
	const handlePhotoUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		triggerToast("Uploading photo, please wait...", "success");

		const formData = new FormData();
		formData.append("photo", file);
		formData.append("module", "teachers");
		formData.append("type", "profilePhoto");
		formData.append("userId", profile.teacherId); // Ya profile.id, jo bhi unique ho

		try {
			// 1. Upload file to VPS
			const uploadRes = await fetch("/api/school/media/upload", {
				method: "POST",
				body: formData,
			});

			const uploadData = await uploadRes.json();

			if (uploadRes.ok) {
				// 2. Set new image URL to UI instantly
				setProfile((prev) => ({
					...prev,
					profilePhoto: uploadData.url,
				}));

				// 3. Save URL to Database
				const dbRes = await fetch("/api/school/teacher/profile", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						actionType: "UPDATE_PROFILE",
						...profile,
						profilePhoto: uploadData.url, // New URL saving to DB
					}),
				});

				if (dbRes.ok) {
					triggerToast(
						"Profile photo updated successfully!",
						"success",
					);
				} else {
					triggerToast(
						"Photo uploaded but database update failed.",
						"error",
					);
				}
			} else {
				triggerToast(uploadData.error || "Upload failed.", "error");
			}
		} catch (error) {
			console.error("Upload error:", error);
			triggerToast("Network error during photo upload.", "error");
		}
	};

	const handleInputChange = (field, value) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const triggerToast = (message, type = "success") => {
		setShowToast({ show: true, message, type });
		setTimeout(
			() => setShowToast({ show: false, message: "", type: "success" }),
			3500,
		);
	};

	// ==========================================
	// 2. SAVE PROFILE CHANGES TO DATABASE
	// ==========================================
	const handleProfileSave = async (e) => {
		e.preventDefault();
		setIsEditing(false);

		try {
			const response = await fetch("/api/school/teacher/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					actionType: "UPDATE_PROFILE",
					...profile,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				triggerToast(
					"Profile information updated in database logs!",
					"success",
				);
			} else {
				triggerToast(
					result.error || "Failed to update profile",
					"error",
				);
			}
		} catch (error) {
			triggerToast("Network error while saving profile.", "error");
		}
	};

	// ==========================================
	// 3. SECURE PASSWORD CHANGE HANDLER
	// ==========================================
	const handlePasswordChange = async (e) => {
		e.preventDefault();

		if (passwords.next !== passwords.confirm) {
			triggerToast("Error: New passwords do not match!", "error");
			return;
		}

		try {
			const response = await fetch("/api/school/teacher/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					actionType: "UPDATE_PASSWORD",
					currentPassword: passwords.current,
					newPassword: passwords.next,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				triggerToast("Security Key Changed Successfully!", "success");
				setPasswords({ current: "", next: "", confirm: "" });
			} else {
				triggerToast(
					result.error || "Password update failed.",
					"error",
				);
			}
		} catch (error) {
			triggerToast("Network error. Could not change password.", "error");
		}
	};

	// Loading UI while fetching data
	if (isLoading || !profile) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-teal-800">
				<Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
				<p className="font-bold tracking-wide">
					Loading Secure Profile...
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Dynamic Database Sync Success/Error Toast */}
				{showToast.show && (
					<div
						className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 text-white
            ${showToast.type === "error" ? "bg-rose-900 border-rose-700" : "bg-teal-900 border-teal-700"}`}
					>
						<span
							className={`p-1 rounded-full text-xs text-white ${showToast.type === "error" ? "bg-rose-500" : "bg-teal-600"}`}
						>
							{showToast.type === "error" ? "✕" : "✓"}
						</span>
						<p className="text-xs font-bold">{showToast.message}</p>
					</div>
				)}

				{/* ================= SECTION 1: TEACHER CARD HEADER ================= */}
				<div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white p-6 rounded-2xl border border-teal-700 shadow-md flex flex-col sm:flex-row items-center gap-6 justify-between">
					<div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
						{/* Interactive Profile Picture Allocation */}
						<div className="relative">
							<img
								src={profile.profilePhoto}
								alt="Teacher Profile"
								className="w-20 h-20 rounded-xl object-cover border-2 border-teal-400 p-0.5 bg-white shadow-md"
							/>
							<label className="absolute -bottom-1 -right-1 bg-teal-600 hover:bg-teal-700 p-1.5 rounded-lg cursor-pointer shadow transition-transform hover:scale-105">
								<Camera size={12} className="text-white" />
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handlePhotoUpload}
								/>
							</label>
						</div>

						<div>
							<h2 className="text-xl font-black tracking-tight">
								{profile.fullName}
							</h2>
							<p className="text-teal-300 font-mono text-xs font-bold uppercase tracking-wide">
								{profile.teacherId} • {profile.department}
							</p>
							<p className="text-slate-300 text-xs mt-1 font-medium">
								{profile.designation}
							</p>
						</div>
					</div>

					<div className="bg-teal-900/50 border border-teal-700 p-2 rounded-xl text-center text-xs font-bold px-4 flex items-center gap-2 shrink-0">
						<ShieldCheck size={14} className="text-teal-400" />{" "}
						Faculty Portal Secure
					</div>
				</div>

				{/* ================= SECTION 2: EDITABLE BASIC INFORMATION ================= */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
					<div className="flex justify-between items-center border-b pb-2.5">
						<h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
							<User size={16} className="text-teal-600" /> General
							Profile Settings
						</h3>

						<button
							type="button"
							onClick={
								isEditing
									? handleProfileSave
									: () => setIsEditing(true)
							}
							className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all shadow-sm ${
								isEditing
									? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
									: "bg-slate-50 hover:bg-slate-100 text-slate-700"
							}`}
						>
							{isEditing ? (
								<Save size={13} />
							) : (
								<Edit2 size={13} className="text-teal-600" />
							)}
							{isEditing ? "Save Settings" : "Edit Profile"}
						</button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold text-slate-500">
						{/* Read Only Institutional Data Blocks */}
						<div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
							<span className="block text-[10px] uppercase text-slate-400 tracking-wider mb-1">
								Official Email Address
							</span>
							<p className="text-sm font-semibold text-slate-700 font-mono flex items-center gap-1.5">
								<Mail size={12} /> {profile.email}
							</p>
						</div>

						<div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
							<span className="block text-[10px] uppercase text-slate-400 tracking-wider mb-1">
								Experience Gauge
							</span>
							<p className="text-sm font-semibold text-slate-700">
								{profile.experience} active service
							</p>
						</div>

						{/* Editable Field Form Inputs */}
						<div
							className={`p-3 rounded-xl border transition-all ${isEditing ? "border-teal-300 bg-white ring-2 ring-teal-50" : "bg-slate-50/80 border-slate-100"}`}
						>
							<span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">
								Primary Phone Contact
							</span>
							{isEditing ? (
								<input
									type="text"
									value={profile.mobileNumber}
									onChange={(e) =>
										handleInputChange(
											"mobileNumber",
											e.target.value,
										)
									}
									className="w-full font-mono text-sm font-bold text-slate-800 bg-transparent border-b border-teal-200 outline-none pb-0.5 focus:border-teal-500"
								/>
							) : (
								<p className="text-sm font-semibold text-slate-800 font-mono flex items-center gap-1.5">
									<Phone size={12} /> {profile.mobileNumber}
								</p>
							)}
						</div>

						<div
							className={`p-3 rounded-xl border transition-all ${isEditing ? "border-teal-300 bg-white ring-2 ring-teal-50" : "bg-slate-50/80 border-slate-100"}`}
						>
							<span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">
								Alternate Backup Phone
							</span>
							{isEditing ? (
								<input
									type="text"
									value={profile.alternateMobile}
									onChange={(e) =>
										handleInputChange(
											"alternateMobile",
											e.target.value,
										)
									}
									className="w-full font-mono text-sm font-bold text-slate-800 bg-transparent border-b border-teal-200 outline-none pb-0.5 focus:border-teal-500"
								/>
							) : (
								<p className="text-sm font-semibold text-slate-800 font-mono">
									{profile.alternateMobile || "None Enlisted"}
								</p>
							)}
						</div>

						<div
							className={`p-3 rounded-xl border transition-all sm:col-span-2 ${isEditing ? "border-teal-300 bg-white ring-2 ring-teal-50" : "bg-slate-50/80 border-slate-100"}`}
						>
							<span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">
								Academic Qualifications Dossier
							</span>
							{isEditing ? (
								<input
									type="text"
									value={profile.qualification}
									onChange={(e) =>
										handleInputChange(
											"qualification",
											e.target.value,
										)
									}
									className="w-full text-sm font-bold text-slate-800 bg-transparent border-b border-teal-200 outline-none pb-0.5 focus:border-teal-500"
								/>
							) : (
								<p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
									<Award
										size={13}
										className="text-teal-600"
									/>{" "}
									{profile.qualification}
								</p>
							)}
						</div>

						<div
							className={`p-3 rounded-xl border transition-all sm:col-span-2 ${isEditing ? "border-teal-300 bg-white ring-2 ring-teal-50" : "bg-slate-50/80 border-slate-100"}`}
						>
							<span className="block text-[10px] uppercase text-teal-600 tracking-wider mb-1">
								Local Residential Address Mapping
							</span>
							{isEditing ? (
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
									<input
										type="text"
										value={profile.address}
										placeholder="Street Address"
										onChange={(e) =>
											handleInputChange(
												"address",
												e.target.value,
											)
										}
										className="sm:col-span-2 text-xs font-bold p-2 border rounded-lg outline-none focus:ring-1 focus:ring-teal-500 bg-white"
									/>
									<input
										type="text"
										value={profile.city}
										placeholder="City"
										onChange={(e) =>
											handleInputChange(
												"city",
												e.target.value,
											)
										}
										className="text-xs font-bold p-2 border rounded-lg outline-none focus:ring-1 focus:ring-teal-500 bg-white"
									/>
									<input
										type="text"
										value={profile.pincode}
										placeholder="Pincode"
										onChange={(e) =>
											handleInputChange(
												"pincode",
												e.target.value,
											)
										}
										className="text-xs font-bold p-2 border rounded-lg outline-none focus:ring-1 focus:ring-teal-500 bg-white mt-2 sm:mt-0"
									/>
								</div>
							) : (
								<p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
									<MapPin size={13} className="shrink-0" />{" "}
									{profile.address}, {profile.city}{" "}
									{profile.pincode
										? `- ${profile.pincode}`
										: ""}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* ================= SECTION 3: INLINE PASSWORD Swap SYSTEM ================= */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
					<div className="border-b pb-2">
						<h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
							<Lock size={16} className="text-teal-600" /> Reset
							Security Access Password
						</h3>
					</div>

					<form
						onSubmit={handlePasswordChange}
						className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-500"
					>
						{/* Field A: Current Password */}
						<div className="space-y-1 relative">
							<label className="text-[10px] uppercase tracking-wider text-slate-400">
								Current Security Key
							</label>
							<input
								type={showPass.current ? "text" : "password"}
								value={passwords.current}
								onChange={(e) =>
									setPasswords((p) => ({
										...p,
										current: e.target.value,
									}))
								}
								required
								placeholder="••••••••"
								className="w-full font-mono font-bold text-sm bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
							/>
							<button
								type="button"
								onClick={() =>
									setShowPass((f) => ({
										...f,
										current: !f.current,
									}))
								}
								className="absolute right-3 bottom-3 text-slate-400 hover:text-teal-600"
							>
								{showPass.current ? (
									<EyeOff size={13} />
								) : (
									<Eye size={13} />
								)}
							</button>
						</div>

						{/* Field B: New Password */}
						<div className="space-y-1 relative">
							<label className="text-[10px] uppercase tracking-wider text-slate-400">
								New Proposed Key
							</label>
							<input
								type={showPass.next ? "text" : "password"}
								value={passwords.next}
								onChange={(e) =>
									setPasswords((p) => ({
										...p,
										next: e.target.value,
									}))
								}
								required
								placeholder="••••••••"
								className="w-full font-mono font-bold text-sm bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
							/>
							<button
								type="button"
								onClick={() =>
									setShowPass((f) => ({
										...f,
										next: !f.next,
									}))
								}
								className="absolute right-3 bottom-3 text-slate-400 hover:text-teal-600"
							>
								{showPass.next ? (
									<EyeOff size={13} />
								) : (
									<Eye size={13} />
								)}
							</button>
						</div>

						{/* Field C: Confirm Password */}
						<div className="space-y-1 relative">
							<label className="text-[10px] uppercase tracking-wider text-slate-400">
								Confirm Proposed Key
							</label>
							<input
								type={showPass.confirm ? "text" : "password"}
								value={passwords.confirm}
								onChange={(e) =>
									setPasswords((p) => ({
										...p,
										confirm: e.target.value,
									}))
								}
								required
								placeholder="••••••••"
								className="w-full font-mono font-bold text-sm bg-slate-50 border p-2.5 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
							/>
							<button
								type="button"
								onClick={() =>
									setShowPass((f) => ({
										...f,
										confirm: !f.confirm,
									}))
								}
								className="absolute right-3 bottom-3 text-slate-400 hover:text-teal-600"
							>
								{showPass.confirm ? (
									<EyeOff size={13} />
								) : (
									<Eye size={13} />
								)}
							</button>
						</div>

						{/* Password Trigger Submit Button Row */}
						<div className="sm:col-span-3 flex justify-end pt-2">
							<button
								type="submit"
								className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
							>
								Confirm Account Password Swap
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

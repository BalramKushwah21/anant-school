"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Filter, Edit2, X, Save, 
    User, Briefcase, CreditCard, Phone, Mail, MapPin, Shield
} from "lucide-react";

// --- MOCK DATABASE (Replace with Prisma fetch) ---
const INITIAL_STAFF = [
    { 
        id: "STF-1024", firstName: "Priya", lastName: "Sharma", gender: "FEMALE", dob: "1990-05-15", phone: "9876543210", email: "priya.s@school.com", address: "123 Tech Park, Sector 4",
        employeeId: "EMP-001", designation: "ACCOUNTANT", department: "FINANCE", dateOfJoining: "2023-04-01", qualification: "B.Com, CA Inter", experience: "5",
        basicSalary: 35000, bankName: "HDFC Bank", accountNumber: "123456789012", ifscCode: "HDFC0001234", panNumber: "ABCDE1234F",
        isActive: true
    },
    { 
        id: "STF-1025", firstName: "Rahul", lastName: "Kumar", gender: "MALE", dob: "1985-08-22", phone: "9123456789", email: "rahul.k@school.com", address: "45 Transport Ave, Phase 1",
        employeeId: "EMP-002", designation: "DRIVER", department: "TRANSPORT", dateOfJoining: "2021-07-15", qualification: "12th Pass", experience: "10",
        basicSalary: 18000, bankName: "SBI", accountNumber: "987654321098", ifscCode: "SBIN0009876", panNumber: "FGHIJ5678K",
        isActive: true
    },
    { 
        id: "STF-1026", firstName: "Anita", lastName: "Desai", gender: "FEMALE", dob: "1992-11-30", phone: "9988776655", email: "anita.d@school.com", address: "Library Quarters, Block B",
        employeeId: "EMP-003", designation: "LIBRARIAN", department: "LIBRARY", dateOfJoining: "2022-01-10", qualification: "M.Lib", experience: "4",
        basicSalary: 28000, bankName: "ICICI Bank", accountNumber: "555566667777", ifscCode: "ICIC0005555", panNumber: "KLMNO9012P",
        isActive: false
    }
];

export default function StaffDirectoryPage() {
    // --- STATE MANAGEMENT ---
    const [staffList, setStaffList] = useState(INITIAL_STAFF);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("ALL");
    
    // Panel & Edit State
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- FILTER LOGIC ---
    const filteredStaff = useMemo(() => {
        return staffList.filter(staff => {
            const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = departmentFilter === "ALL" || staff.department === departmentFilter;
            return matchesSearch && matchesDept;
        });
    }, [staffList, searchTerm, departmentFilter]);

    // --- HANDLERS ---
    const openProfile = (staff) => {
        setSelectedStaff({ ...staff }); // Deep copy to isolate changes
        setIsEditMode(false);
    };

    const closeProfile = () => {
        setSelectedStaff(null);
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedStaff(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // 🗄️ DATABASE PAYLOAD READY
        console.log("Updating Staff Record in DB:", selectedStaff);

        // Simulate API Update
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update local UI state
        setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
        
        setIsSaving(false);
        setIsEditMode(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header & Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="text-indigo-600 w-6 h-6" />
                            Staff Directory
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage profiles, roles, and payroll information for non-teaching staff.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search name or ID..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select 
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="w-full sm:w-48 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Departments</option>
                                <option value="FINANCE">Finance & Accounts</option>
                                <option value="LIBRARY">Library</option>
                                <option value="TRANSPORT">Transport</option>
                                <option value="ADMINISTRATION">Administration</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white text-sm font-medium">
                                    <th className="p-4 py-5 rounded-tl-xl">Staff Member</th>
                                    <th className="p-4 py-5">Role & Dept</th>
                                    <th className="p-4 py-5">Contact Info</th>
                                    <th className="p-4 py-5">Status</th>
                                    <th className="p-4 py-5 rounded-tr-xl text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStaff.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${staff.isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                                                    {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{staff.firstName} {staff.lastName}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{staff.employeeId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-slate-800">{staff.designation}</div>
                                            <div className="text-xs text-slate-500">{staff.department}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-600 flex items-center gap-1.5"><Phone className="w-3 h-3"/> {staff.phone}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5"><Mail className="w-3 h-3"/> {staff.email || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${staff.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {staff.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => openProfile(staff)}
                                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sliding Detail / Edit Panel */}
                <AnimatePresence>
                    {selectedStaff && (
                        <>
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={closeProfile}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                            />
                            
                            {/* Slide Panel */}
                            <motion.div 
                                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
                            >
                                {/* Panel Header */}
                                <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">
                                            {isEditMode ? "Edit Staff Profile" : "Staff Profile Overview"}
                                        </h2>
                                        <p className="text-sm text-slate-500">{selectedStaff.employeeId}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {!isEditMode ? (
                                            <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition">
                                                <Edit2 className="w-4 h-4" /> Edit Details
                                            </button>
                                        ) : (
                                            <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition">
                                                Cancel Edit
                                            </button>
                                        )}
                                        <button onClick={closeProfile} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-full transition">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Panel Content (Form) */}
                                <form onSubmit={handleSaveChanges} className="p-6 space-y-8 flex-1">
                                    
                                    {/* SECTION: PERSONAL */}
                                    <div>
                                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-4">
                                            <User className="w-4 h-4" /> Personal Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                                                <input type="text" name="firstName" value={selectedStaff.firstName} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                                                <input type="text" name="lastName" value={selectedStaff.lastName} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth</label>
                                                <input type="date" name="dob" value={selectedStaff.dob} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Number</label>
                                                <input type="tel" name="phone" value={selectedStaff.phone} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Residential Address</label>
                                                <textarea name="address" value={selectedStaff.address} onChange={handleInputChange} disabled={!isEditMode} rows="2" className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 disabled:resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: PROFESSIONAL */}
                                    <div>
                                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-4">
                                            <Briefcase className="w-4 h-4" /> Professional Roles
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Designation</label>
                                                {isEditMode ? (
                                                    <select name="designation" value={selectedStaff.designation} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                        <option value="ACCOUNTANT">Accountant</option>
                                                        <option value="LIBRARIAN">Librarian</option>
                                                        <option value="DRIVER">Driver</option>
                                                        <option value="HR">HR Manager</option>
                                                    </select>
                                                ) : (
                                                    <div className="font-medium text-slate-800">{selectedStaff.designation}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
                                                {isEditMode ? (
                                                    <select name="department" value={selectedStaff.department} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                        <option value="FINANCE">Finance & Accounts</option>
                                                        <option value="LIBRARY">Library</option>
                                                        <option value="TRANSPORT">Transport</option>
                                                        <option value="ADMINISTRATION">Administration</option>
                                                    </select>
                                                ) : (
                                                    <div className="font-medium text-slate-800">{selectedStaff.department}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Joining</label>
                                                <input type="date" name="dateOfJoining" value={selectedStaff.dateOfJoining} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                                                {isEditMode ? (
                                                    <label className="flex items-center gap-2 mt-1 cursor-pointer">
                                                        <input type="checkbox" name="isActive" checked={selectedStaff.isActive} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 rounded" />
                                                        <span className="text-sm font-medium text-slate-700">Account Active</span>
                                                    </label>
                                                ) : (
                                                    <div className={`font-semibold ${selectedStaff.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {selectedStaff.isActive ? 'Active Employee' : 'Deactivated'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: PAYROLL */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                                            <CreditCard className="w-4 h-4 text-slate-500" /> Payroll & Bank Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Basic Salary (₹)</label>
                                                <input type="number" name="basicSalary" value={selectedStaff.basicSalary} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">PAN Number</label>
                                                <input type="text" name="panNumber" value={selectedStaff.panNumber} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Bank Account No.</label>
                                                <input type="text" name="accountNumber" value={selectedStaff.accountNumber} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">IFSC Code</label>
                                                <input type="text" name="ifscCode" value={selectedStaff.ifscCode} onChange={handleInputChange} disabled={!isEditMode} className="w-full p-2 border rounded-lg text-sm bg-transparent disabled:border-transparent disabled:p-0 disabled:font-medium disabled:text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer (Only visible in Edit Mode) */}
                                    <AnimatePresence>
                                        {isEditMode && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                                className="sticky bottom-0 bg-white border-t border-slate-100 pt-4 pb-2 mt-auto"
                                            >
                                                <button 
                                                    type="submit"
                                                    disabled={isSaving}
                                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-70"
                                                >
                                                    {isSaving ? "Syncing Database..." : <><Save className="w-5 h-5" /> Save All Changes</>}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
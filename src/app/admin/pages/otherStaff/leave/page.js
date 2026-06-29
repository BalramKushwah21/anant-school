"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CalendarDays, Search, Filter, Edit2, 
    CheckCircle, XCircle, Clock, X, Save 
} from "lucide-react";

// --- MOCK DATABASE (Replace with Prisma fetch) ---
const INITIAL_LEAVES = [
    { id: "LV-001", applicantName: "Rahul Sharma", role: "Math Teacher", type: "Sick Leave", fromDate: "2026-06-28", toDate: "2026-06-30", status: "APPROVED", appliedOn: "2026-06-27", remarks: "" },
    { id: "LV-002", applicantName: "Priya Singh", role: "Accountant", type: "Casual Leave", fromDate: "2026-07-02", toDate: "2026-07-03", status: "PENDING", appliedOn: "2026-06-28", remarks: "" },
    { id: "LV-003", applicantName: "Amit Patel", role: "Driver", type: "Urgent Leave", fromDate: "2026-06-29", toDate: "2026-06-29", status: "REJECTED", appliedOn: "2026-06-28", remarks: "Required for duty." },
    { id: "LV-004", applicantName: "Sunita Devi", role: "Librarian", type: "Maternity", fromDate: "2026-07-01", toDate: "2026-12-31", status: "APPROVED", appliedOn: "2026-06-15", remarks: "Medical cert verified." },
    { id: "LV-005", applicantName: "Karan Verma", role: "Science Teacher", type: "Casual Leave", fromDate: "2026-07-05", toDate: "2026-07-08", status: "PENDING", appliedOn: "2026-06-29", remarks: "" },
];

// --- HELPER COMPONENTS ---
const StatusBadge = ({ status }) => {
    switch (status) {
        case 'APPROVED':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>;
        case 'PENDING':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending</span>;
        case 'REJECTED':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
        default:
            return null;
    }
};

export default function LeaveManagementPage() {
    // --- STATE MANAGEMENT ---
    const [leaves, setLeaves] = useState(INITIAL_LEAVES);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    
    // Modal State
    const [editingLeave, setEditingLeave] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- FILTER LOGIC ---
    const filteredLeaves = useMemo(() => {
        return leaves.filter(leave => {
            const matchesSearch = leave.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || leave.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || leave.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [leaves, searchTerm, statusFilter]);

    // --- HANDLERS ---
    const openEditModal = (leave) => {
        setEditingLeave({ ...leave }); // Deep copy for editing safely
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setEditingLeave(prev => ({ ...prev, [name]: value }));
    };

    const saveLeaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // 🗄️ DATABASE PAYLOAD READY
        const dbUpdatePayload = {
            leaveId: editingLeave.id,
            fromDate: editingLeave.fromDate,
            toDate: editingLeave.toDate,
            status: editingLeave.status,
            adminRemarks: editingLeave.remarks
        };

        console.log("Pushing Update to Database:", dbUpdatePayload);

        // Simulate API Request
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update local state to reflect UI instantly
        setLeaves(prev => prev.map(l => l.id === editingLeave.id ? editingLeave : l));
        
        setIsSaving(false);
        setEditingLeave(null); // Close modal
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <CalendarDays className="text-indigo-600 w-6 h-6" />
                            Leave Administration
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Review, approve, and modify staff & teacher leave records.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search applicant..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-40 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Table View */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white text-sm font-medium">
                                    <th className="p-4 py-5 rounded-tl-xl">Applicant</th>
                                    <th className="p-4 py-5">Leave Type</th>
                                    <th className="p-4 py-5">From Date</th>
                                    <th className="p-4 py-5">To Date</th>
                                    <th className="p-4 py-5">Status</th>
                                    <th className="p-4 py-5 rounded-tr-xl text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">{leave.applicantName}</div>
                                            <div className="text-xs text-slate-500">{leave.role}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-700 font-medium">
                                            {leave.type}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {new Date(leave.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {new Date(leave.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={leave.status} />
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => openEditModal(leave)}
                                                className="inline-flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                                                title="Edit Leave Request"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeaves.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">No leave records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal / Pop-up Overlay */}
                <AnimatePresence>
                    {editingLeave && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                            >
                                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Edit Leave Request</h3>
                                        <p className="text-xs text-slate-500">Ref: {editingLeave.id} • {editingLeave.applicantName}</p>
                                    </div>
                                    <button onClick={() => setEditingLeave(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={saveLeaveChanges} className="p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">From Date</label>
                                            <input 
                                                type="date" 
                                                name="fromDate"
                                                value={editingLeave.fromDate}
                                                onChange={handleModalChange}
                                                required
                                                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">To Date</label>
                                            <input 
                                                type="date" 
                                                name="toDate"
                                                value={editingLeave.toDate}
                                                onChange={handleModalChange}
                                                required
                                                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Approval Status</label>
                                        <select 
                                            name="status"
                                            value={editingLeave.status}
                                            onChange={handleModalChange}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                                        >
                                            <option value="PENDING">Pending Assessment</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Admin Remarks (Optional)</label>
                                        <textarea 
                                            name="remarks"
                                            value={editingLeave.remarks}
                                            onChange={handleModalChange}
                                            rows="2"
                                            placeholder="Add note for the applicant..."
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isSaving ? "Updating Database..." : <><Save className="w-4 h-4" /> Save Changes</>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
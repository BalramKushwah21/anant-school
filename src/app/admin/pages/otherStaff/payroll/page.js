"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Filter, DollarSign, Building2, UserCircle, 
    Calculator, ArrowLeft, Printer, CheckCircle, AlertCircle 
} from "lucide-react";

// --- MOCK DATABASE (Replace with Prisma fetch later) ---
const MOCK_STAFF_DB = [
    { id: "STF-1001", name: "Ramesh Kumar", role: "Driver", department: "Transport", basicSalary: 18000, bankAc: "XXXX1234", pfNo: "PF-9087" },
    { id: "STF-1002", name: "Priya Sharma", role: "Accountant", department: "Finance", basicSalary: 35000, bankAc: "XXXX5678", pfNo: "PF-9088" },
    { id: "STF-1003", name: "Amit Patel", role: "IT Admin", department: "Technology", basicSalary: 42000, bankAc: "XXXX9012", pfNo: "PF-9089" },
    { id: "STF-1004", name: "Sunita Devi", role: "Librarian", department: "Library", basicSalary: 25000, bankAc: "XXXX3456", pfNo: "PF-9090" },
    { id: "STF-1005", name: "Raju Singh", role: "Security", department: "Administration", basicSalary: 15000, bankAc: "XXXX7890", pfNo: "PF-9091" },
];

// --- HELPER FUNCTIONS ---
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const numberToWords = (num) => {
    // Simplified number to words for demonstration. 
    // In production, use a library like 'number-to-words'
    if (num === 0) return "Zero";
    return "Rupees " + num.toLocaleString('en-IN') + " Only"; // Fallback string representation
};

export default function StaffPayrollManager() {
    // --- STATE MANAGEMENT ---
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDisbursed, setIsDisbursed] = useState(false);

    // Payroll Calculation State (Loads when a staff is selected)
    const [payroll, setPayroll] = useState({
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        workingDays: 30,
        presentDays: 30,
        earnings: { basic: 0, hra: 0, specialAllowance: 0, bonus: 0 },
        deductions: { pf: 0, tax: 0, unpaidLeave: 0, advance: 0 }
    });

    // --- FILTER LOGIC ---
    const filteredStaff = useMemo(() => {
        return MOCK_STAFF_DB.filter(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // --- DERIVED CALCULATIONS (Live Updates) ---
    const totalEarnings = Object.values(payroll.earnings).reduce((a, b) => Number(a) + Number(b), 0);
    const totalDeductions = Object.values(payroll.deductions).reduce((a, b) => Number(a) + Number(b), 0);
    const netPayable = totalEarnings - totalDeductions;

    // --- HANDLERS ---
    const handleSelectStaff = (staff) => {
        setSelectedStaff(staff);
        setIsDisbursed(false);
        // Pre-fill default payroll data based on their DB profile
        setPayroll({
            month: new Date().toISOString().slice(0, 7),
            workingDays: 30,
            presentDays: 30,
            earnings: { 
                basic: staff.basicSalary, 
                hra: Math.round(staff.basicSalary * 0.20), // 20% default HRA
                specialAllowance: 0, 
                bonus: 0 
            },
            deductions: { 
                pf: Math.round(staff.basicSalary * 0.12), // 12% default PF
                tax: staff.basicSalary > 30000 ? 500 : 0, 
                unpaidLeave: 0, 
                advance: 0 
            }
        });
    };

    const handleEarningsChange = (field, value) => {
        setPayroll(prev => ({ ...prev, earnings: { ...prev.earnings, [field]: Number(value) } }));
    };

    const handleDeductionsChange = (field, value) => {
        setPayroll(prev => ({ ...prev, deductions: { ...prev.deductions, [field]: Number(value) } }));
    };

    const handleProcessPayroll = async () => {
        setIsProcessing(true);
        
        // 🗄️ DATABASE PAYLOAD READY
        const dbPayload = {
            staffId: selectedStaff.id,
            payrollMonth: payroll.month,
            workingDays: payroll.workingDays,
            presentDays: payroll.presentDays,
            grossEarnings: totalEarnings,
            totalDeductions: totalDeductions,
            netPayable: netPayable,
            breakdown: payroll
        };
        
        console.log("Saving to Database via Prisma:", dbPayload);
        
        // Simulate DB Latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsProcessing(false);
        setIsDisbursed(true);
        alert(`Payroll processed securely! ₹${netPayable} recorded for ${selectedStaff.name}.`);
    };

    // ==========================================
    // RENDER: VIEW 1 - STAFF ROSTER
    // ==========================================
    if (!selectedStaff) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Building2 className="text-indigo-600 w-6 h-6" />
                                Staff Payroll Management
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">Select a staff member to process their monthly salary slip.</p>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search by name, ID, or role..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-sm font-medium">
                                        <th className="p-4 py-5 rounded-tl-xl">Employee ID</th>
                                        <th className="p-4 py-5">Staff Member</th>
                                        <th className="p-4 py-5">Department & Role</th>
                                        <th className="p-4 py-5">Base Salary</th>
                                        <th className="p-4 py-5 rounded-tr-xl text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStaff.map((staff) => (
                                        <tr key={staff.id} className="hover:bg-indigo-50/50 transition-colors group">
                                            <td className="p-4 text-sm font-mono font-medium text-slate-600">{staff.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                        {staff.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{staff.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-slate-800">{staff.role}</div>
                                                <div className="text-xs text-slate-500">{staff.department}</div>
                                            </td>
                                            <td className="p-4 text-sm font-semibold text-slate-700">
                                                {formatINR(staff.basicSalary)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => handleSelectStaff(staff)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-indigo-700 hover:bg-indigo-600 hover:text-white text-sm font-semibold rounded-lg transition-all"
                                                >
                                                    <Calculator className="w-4 h-4" />
                                                    Generate Slip
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStaff.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">No staff members found matching your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER: VIEW 2 - LIVE GENERATOR
    // ==========================================
    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Top Navigation - HIDDEN ON PRINT */}
                <div className="mb-6 flex justify-between items-center print:hidden">
                    <button 
                        onClick={() => setSelectedStaff(null)}
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Staff Roster
                    </button>
                    
                    {isDisbursed && (
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" /> Print Official Payslip
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT PANEL: DATA ENTRY (HIDDEN ON PRINT) */}
                    <div className="lg:col-span-5 space-y-6 print:hidden">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-5">Payroll Adjustments</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Payroll Month</label>
                                    <input 
                                        type="month" 
                                        value={payroll.month}
                                        onChange={(e) => setPayroll({...payroll, month: e.target.value})}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        disabled={isDisbursed}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Days</label>
                                        <input type="number" value={payroll.workingDays} onChange={(e) => setPayroll({...payroll, workingDays: e.target.value})} disabled={isDisbursed} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none bg-slate-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Present Days</label>
                                        <input type="number" value={payroll.presentDays} onChange={(e) => setPayroll({...payroll, presentDays: e.target.value})} disabled={isDisbursed} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Earnings Form */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg mb-3">Earnings (+)</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Basic Pay</span>
                                        <input type="number" value={payroll.earnings.basic} onChange={(e) => handleEarningsChange('basic', e.target.value)} disabled={isDisbursed} className="w-32 p-1.5 border rounded text-right text-sm" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">HRA Allowance</span>
                                        <input type="number" value={payroll.earnings.hra} onChange={(e) => handleEarningsChange('hra', e.target.value)} disabled={isDisbursed} className="w-32 p-1.5 border rounded text-right text-sm" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Special Allowance</span>
                                        <input type="number" value={payroll.earnings.specialAllowance} onChange={(e) => handleEarningsChange('specialAllowance', e.target.value)} disabled={isDisbursed} className="w-32 p-1.5 border rounded text-right text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Deductions Form */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-rose-700 bg-rose-50 p-2 rounded-lg mb-3">Deductions (-)</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Provident Fund (PF)</span>
                                        <input type="number" value={payroll.deductions.pf} onChange={(e) => handleDeductionsChange('pf', e.target.value)} disabled={isDisbursed} className="w-32 p-1.5 border rounded text-right text-sm" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">TDS / Prof. Tax</span>
                                        <input type="number" value={payroll.deductions.tax} onChange={(e) => handleDeductionsChange('tax', e.target.value)} disabled={isDisbursed} className="w-32 p-1.5 border rounded text-right text-sm" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Unpaid Leave Cut</span>
                                        <input type="number" value={payroll.deductions.unpaidLeave} onChange={(e) => handleDeductionsChange('unpaidLeave', e.target.value)} disabled={isDisbursed} className="w-32 p-1.5 border rounded text-right text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isDisbursed && (
                                <button 
                                    onClick={handleProcessPayroll}
                                    disabled={isProcessing}
                                    className="w-full mt-8 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isProcessing ? "Processing Database Sync..." : "Confirm & Generate Payslip"}
                                </button>
                            )}
                            {isDisbursed && (
                                <div className="w-full mt-8 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Synced to Database Successfully
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: LIVE A4 DOCUMENT (Printable) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-sm shadow-xl p-8 border border-slate-200 relative print:shadow-none print:border-none print:p-0">
                            
                            {/* Watermark Overlay */}
                            {isDisbursed && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0 overflow-hidden">
                                    <div className="text-[120px] font-black text-emerald-900 -rotate-45 tracking-widest">
                                        PROCESSED
                                    </div>
                                </div>
                            )}

                            {/* Document Header */}
                            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6 relative z-10">
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Excel Academy International</h1>
                                <p className="text-sm text-slate-600">123 Education Boulevard, Tech District, 10001</p>
                                <p className="text-sm text-slate-600 mb-4">Ph: +1 234 567 8900 | Email: hr@excelacademy.edu</p>
                                <div className="inline-block bg-slate-100 px-4 py-1.5 rounded text-sm font-bold text-slate-800 uppercase border border-slate-200">
                                    Salary Slip for {new Date(payroll.month + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Employee Details Grid */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8 text-sm relative z-10">
                                <div className="grid grid-cols-2">
                                    <span className="text-slate-500 font-medium">Employee Name:</span>
                                    <span className="font-bold text-slate-800">{selectedStaff.name}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-slate-500 font-medium">Employee ID:</span>
                                    <span className="font-bold text-slate-800">{selectedStaff.id}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-slate-500 font-medium">Designation:</span>
                                    <span className="font-bold text-slate-800">{selectedStaff.role}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-slate-500 font-medium">Department:</span>
                                    <span className="font-bold text-slate-800">{selectedStaff.department}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-slate-500 font-medium">Days Worked:</span>
                                    <span className="font-bold text-slate-800">{payroll.presentDays} / {payroll.workingDays}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-slate-500 font-medium">Bank A/C No:</span>
                                    <span className="font-bold text-slate-800">{selectedStaff.bankAc}</span>
                                </div>
                            </div>

                            {/* Financial Matrix */}
                            <div className="flex border border-slate-300 rounded overflow-hidden relative z-10">
                                {/* Left Side: Earnings */}
                                <div className="w-1/2 border-r border-slate-300">
                                    <div className="bg-slate-100 p-2 border-b border-slate-300 font-bold text-slate-800 text-sm text-center">EARNINGS</div>
                                    <div className="p-4 space-y-3 text-sm">
                                        <div className="flex justify-between"><span>Basic Pay</span><span>{formatINR(payroll.earnings.basic)}</span></div>
                                        {payroll.earnings.hra > 0 && <div className="flex justify-between"><span>HRA</span><span>{formatINR(payroll.earnings.hra)}</span></div>}
                                        {payroll.earnings.specialAllowance > 0 && <div className="flex justify-between"><span>Special Allowance</span><span>{formatINR(payroll.earnings.specialAllowance)}</span></div>}
                                    </div>
                                </div>

                                {/* Right Side: Deductions */}
                                <div className="w-1/2">
                                    <div className="bg-slate-100 p-2 border-b border-slate-300 font-bold text-slate-800 text-sm text-center">DEDUCTIONS</div>
                                    <div className="p-4 space-y-3 text-sm">
                                        {payroll.deductions.pf > 0 && <div className="flex justify-between"><span>Provident Fund</span><span>{formatINR(payroll.deductions.pf)}</span></div>}
                                        {payroll.deductions.tax > 0 && <div className="flex justify-between"><span>TDS / Tax</span><span>{formatINR(payroll.deductions.tax)}</span></div>}
                                        {payroll.deductions.unpaidLeave > 0 && <div className="flex justify-between text-rose-600"><span>Unpaid Leaves</span><span>{formatINR(payroll.deductions.unpaidLeave)}</span></div>}
                                    </div>
                                </div>
                            </div>

                            {/* Gross Totals */}
                            <div className="flex border border-t-0 border-slate-300 bg-slate-50 relative z-10 text-sm font-bold text-slate-800">
                                <div className="w-1/2 p-3 border-r border-slate-300 flex justify-between">
                                    <span>Gross Earnings:</span>
                                    <span>{formatINR(totalEarnings)}</span>
                                </div>
                                <div className="w-1/2 p-3 flex justify-between">
                                    <span>Total Deductions:</span>
                                    <span>{formatINR(totalDeductions)}</span>
                                </div>
                            </div>

                            {/* Final Net Payable (The Big Box) */}
                            <div className="mt-6 bg-slate-900 text-white rounded-lg p-5 flex flex-col md:flex-row items-center justify-between relative z-10">
                                <div>
                                    <div className="text-slate-300 text-xs font-bold uppercase tracking-wider">Net Salary Payable</div>
                                    <div className="text-3xl font-black mt-1">{formatINR(netPayable)}</div>
                                </div>
                                <div className="text-right mt-3 md:mt-0">
                                    <div className="text-slate-300 text-xs uppercase tracking-wider mb-1">Amount in Words</div>
                                    <div className="text-sm font-medium italic">{numberToWords(netPayable)}</div>
                                </div>
                            </div>

                            {/* Footer Signatures */}
                            <div className="mt-20 flex justify-between px-8 text-sm font-medium text-slate-500 relative z-10">
                                <div className="text-center border-t border-slate-400 w-40 pt-2">HR/Admin Signature</div>
                                <div className="text-center border-t border-slate-400 w-40 pt-2">Employee Signature</div>
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-8 relative z-10">This is a system-generated document. Ensure verification before disbursement.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
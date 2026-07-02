"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  CalendarCheck, UserCheck, XCircle, BarChart, 
  Clock, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function ParentAttendancePage() {
  const { data: session, status } = useSession();
  
  const [students, setStudents] = useState([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (status === "loading") return;
      
      if (!session?.user) {
        setError("Please login to view attendance records.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/school/parents/attendance`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load attendance data.");
        }
        
        setStudents(data.students);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [session, status]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Attendance Records...</p>
      </div>
    );
  }

  if (error || students.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-red-700">Records Not Found</h2>
        <p className="text-red-600 mt-2">{error || "No student assigned to this account."}</p>
      </div>
    );
  }

  const activeChild = students[activeChildIndex];
  const { summary, recentHistory } = activeChild;

  // Status Badge Color Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ABSENT': return 'bg-red-100 text-red-700 border-red-200';
      case 'LATE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'HALF_DAY': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Child Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Summary</h1>
          <p className="text-sm text-gray-500 mt-1">Track your child's presence and daily logs.</p>
        </div>
        
        {/* Child Selector Dropdown */}
        <div className="flex items-center gap-4 bg-gray-50 p-2 pl-4 rounded-xl border border-gray-200">
          <img src={activeChild.avatar} alt="Student" className="w-10 h-10 rounded-full border border-gray-300 bg-white" />
          <select 
            className="bg-transparent border-none text-gray-800 font-semibold focus:ring-0 cursor-pointer w-48 outline-none"
            value={activeChildIndex}
            onChange={(e) => setActiveChildIndex(Number(e.target.value))}
          >
            {students.map((child, idx) => (
              <option key={child.id} value={idx}>{child.name} ({child.class})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Percentage Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 mb-3"><BarChart className="w-6 h-6" /></div>
          <p className="text-sm font-semibold text-gray-500">Overall Attendance</p>
          <p className={`text-3xl font-black mt-1 ${summary.percentage >= 75 ? 'text-indigo-600' : 'text-red-500'}`}>
            {summary.percentage}%
          </p>
        </div>

        {/* Total Days */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-3"><CalendarCheck className="w-6 h-6" /></div>
          <p className="text-sm font-semibold text-gray-500">Total School Days</p>
          <p className="text-3xl font-black text-gray-800 mt-1">{summary.totalDays}</p>
        </div>

        {/* Present Days */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 mb-3"><UserCheck className="w-6 h-6" /></div>
          <p className="text-sm font-semibold text-gray-500">Days Present</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{summary.presentDays}</p>
        </div>

        {/* Absent Days */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-red-50 rounded-full text-red-600 mb-3"><XCircle className="w-6 h-6" /></div>
          <p className="text-sm font-semibold text-gray-500">Days Absent</p>
          <p className="text-3xl font-black text-red-600 mt-1">{summary.absentDays}</p>
        </div>
      </div>

      {/* 3. Recent Attendance History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">Recent Attendance Logs</h2>
        </div>
        
        <div className="overflow-x-auto">
          {recentHistory.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No attendance records found yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b">Date</th>
                  <th className="p-4 font-semibold border-b">Status</th>
                  <th className="p-4 font-semibold border-b">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentHistory.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-800">{log.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(log.status)}`}>
                        {log.status === 'PRESENT' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {log.status === 'ABSENT' && <XCircle className="w-3 h-3 inline mr-1" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{log.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
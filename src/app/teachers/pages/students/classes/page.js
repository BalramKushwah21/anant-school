"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldCheck, Clock, BrainCircuit 
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";

export default function TeacherClassDashboard() {
  const [classesData, setClassesData] = useState({});
  const [activeClassKey, setActiveClassKey] = useState(null);
  const [loading, setLoading] = useState(true);

  // API se database mapping fetch karna
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/school/teacher/classes");
        if (!response.ok) {
          throw new Error(`Server responded with a ${response.status} error.`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setClassesData(result.data);
          // By default, list ki pehli class ko active set karein
          const firstKey = Object.keys(result.data)[0];
          if (firstKey) setActiveClassKey(firstKey);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const activeClassData = useMemo(() => {
    return classesData[activeClassKey] || null;
  }, [classesData, activeClassKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 bg-teal-500 rounded-full animate-bounce"></div>
          <p className="text-slate-500 font-bold tracking-wider uppercase text-sm">Loading Database Matrices...</p>
        </div>
      </div>
    );
  }

  if (!activeClassData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-slate-500 font-bold">No assigned classes found in the system.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= WORKSPACE MAIN HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
              <ShieldCheck size={14} /> Faculty Hub Cloud Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Assigned Classes
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Select an allocated grade block below to load its full cloud metrics and academic binders.
            </p>
          </div>
        </div>

        {/* ================= USER-DEFINED PREMIUM CLASS CARDS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(classesData).map(([key, data]) => {
            const isCurrentlySelected = activeClassKey === key;
            return (
              <div 
                key={key} 
                className={`bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm overflow-hidden flex flex-col justify-between ${
                  isCurrentlySelected 
                    ? "border-teal-500 ring-4 ring-teal-50 shadow-md" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`p-4 border-b ${isCurrentlySelected ? 'bg-teal-50/50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center justify-between">
                    {data.className}
                    {isCurrentlySelected && (
                      <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active Now
                      </span>
                    )}
                  </h3>
                </div>

                <div className="p-5 space-y-3.5 flex-1">
                  <div className="flex items-center gap-3 font-semibold text-sm text-slate-700">
                    <span className="text-base">👨‍🎓</span>
                    <span>{data.totalStudents} Students Enrolled</span>
                  </div>
                  
                  <div className="flex items-center gap-3 font-semibold text-sm text-slate-700">
                    <span className="text-base">📅</span>
                    <span className="flex items-center gap-2">
                      {data.avgAttendance === "N/A" ? "Attendance N/A" : `${data.avgAttendance}% Average Attendance`}
                      {data.avgAttendance !== "N/A" && (
                        <span className={`w-2 h-2 rounded-full ${data.avgAttendance >= 92 ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-semibold text-sm text-slate-700">
                    <span className="text-base">📖</span>
                    <span>{data.subjectsCount} Subjects Curriculum</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                  <button
                    onClick={() => setActiveClassKey(key)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isCurrentlySelected 
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-200 cursor-default" 
                        : "bg-white hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 shadow-2xs"
                    }`}
                  >
                    {isCurrentlySelected ? "✓ Class Opened" : "[Open Class]"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="border-slate-200 my-8" />

        {/* ================= SELECTED CLASS OPERATIONAL MATRIX VIEWPORT ================= */}
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-3 h-6 bg-teal-600 rounded-md"></div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              Live Overview Matrix: <span className="text-teal-700 font-extrabold">{activeClassData.className}</span>
            </h2>
          </div>

          {/* Core Analytics Quick Widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Boys Enrolment</span>
              <span className="text-2xl font-black text-blue-600 font-mono">{activeClassData.boysCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Girls Enrolment</span>
              <span className="text-2xl font-black text-pink-500 font-mono">{activeClassData.girlsCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Avg Attendance</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {activeClassData.avgAttendance === "N/A" ? "N/A" : `${activeClassData.avgAttendance}%`}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Performance Index</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">{activeClassData.classPerformance}</span>
            </div>
          </div>

          {/* Data Charts & Timelines Segment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Attendance Analytics Graphic */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Weekly Attendance Velocity Line</h3>
                  <p className="text-xs text-slate-400">Micro-analysis trend line tracking daily turnouts.</p>
                </div>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeClassData.weeklyAttendanceTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: "bold" }} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: "11px", fontFamily: "monospace" }} />
                    <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="rate" name="Attendance Rate" stroke="#0d9488" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Examinations Module */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Upcoming Exams</span>
                <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  {activeClassData.upcomingExams.length} Active
                </span>
              </div>
              
              {activeClassData.upcomingExams.length > 0 ? (
                <div className="space-y-3">
                  {activeClassData.upcomingExams.map((exam) => (
                    <div key={exam.id} className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exam.subject}</span>
                        <span className="text-indigo-600">{exam.weightage}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] font-medium">{exam.type}</p>
                      <p className="text-slate-500 font-mono text-[10px] pt-1 border-t border-slate-200/60 mt-1">📅 Target Date: {exam.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="p-8 text-center text-slate-400 font-semibold text-sm border-2 border-dashed rounded-xl">
                   No scheduled exams mapped in database.
                 </div>
              )}
            </div>

            {/* Assignments Allocation Tracker Workflow */}
            <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Pending Assignments & Submissions Checklist</span>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  {activeClassData.pendingAssignments.length > 0 ? "Action Required" : "Up To Date"}
                </span>
              </div>
              
              {activeClassData.pendingAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeClassData.pendingAssignments.map((assign) => (
                    <div key={assign.id} className="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between gap-3 hover:bg-slate-100/50 transition">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-xs text-slate-800 leading-tight">{assign.title}</h4>
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                            <Clock size={10} /> {assign.due}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] bg-white p-2 rounded-lg border font-bold">
                        <span className="text-slate-400 font-medium">Submissions:</span>
                        <span className="text-teal-700 font-mono">{assign.submissions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 font-semibold text-sm border-2 border-dashed rounded-xl">
                  No active assignments documented for this class.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* System Operations Base Ribbon */}
        <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-xs font-semibold flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="flex items-center gap-2 text-slate-300">
            <BrainCircuit size={14} className="text-teal-400" />
            Class Cards dynamically mapped to database configurations.
          </span>
          <button 
            onClick={() => window.print()}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 transition text-white px-3 py-1.5 rounded-lg border border-slate-700 font-bold"
          >
            Print Overview Memo
          </button>
        </div>

      </div>
    </div>
  );
}
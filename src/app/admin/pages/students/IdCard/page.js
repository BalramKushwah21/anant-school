"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ShieldCheck,
  Printer,
  QrCode,
  Scan,
  Phone,
  User,
  GraduationCap,
  Hash,
  MapPin,
  Heart,
  AlertCircle,
  Search,
  Droplet,
} from "lucide-react";

// ==========================================
// SUB-COMPONENT: Single ID Card Design
// ==========================================
const StudentIdCard = ({ student }) => (
//  {/* --- 1. Card Header --- */}
  <div
            id="printable-id-card-element"
            className="w-[260px] h-[400px] bg-gradient-to-b from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-5 shadow-xl text-white relative flex flex-col justify-between border border-slate-700 print:shadow-none [print-color-adjust:exact]"
          >

      <header className="text-center border-b pb-2.5 shrink-0">
        <h4 className="text-[11px] font-black tracking-widest uppercase text-teal-400 print:text-slate-800 leading-tight truncate">
          {student?.schoolName || "School Name"}
        </h4>
        <p className="text-[7px] tracking-wider text-slate-400 print:text-slate-500 uppercase mt-0.5">
          Student Identity Card
        </p>
      </header>

 
      <main className="flex-1 flex flex-col items-center justify-center space-y-3 mt-2">
        
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <img
            src={student?.avatar || `https://ui-avatars.com/api/?name=${student?.name || 'Student'}&background=0D9488&color=fff`}
            alt={`${student?.name}'s Avatar`}
            loading="lazy"
            className="w-16 h-16 rounded-full object-cover border-2  bg-slate-900 shadow-md "
          />
          <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1 border-2 border-slate-800 print:border-white">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Identity Labels */}
        <div className="text-center w-full px-2">
          <h3 className="text-base font-extrabold tracking-wide text-white print:text-black truncate">
            {student?.name || "Student Name"}
          </h3>
          <p className="text-[10px] font-semibold text-teal-400 print:text-teal-700 mt-0.5 truncate">
            Class {student?.class || "N/A"} - {student?.section || "A"}
          </p>
        </div>

        {/* Details Data Matrix */}
        <div className="w-full bg-slate-950/40 print:bg-transparent p-2.5 rounded-xl text-[9px]">
          <DetailRow icon={Hash} label="Roll No" value={student?.rollNumber} highlightValue />
          <DetailRow icon={Heart} label="Father" value={student?.fatherName} />
          <DetailRow icon={Phone} label="Phone" value={student?.phone} isMono />
          <DetailRow icon={Droplet} label="Blood" value={student?.bloodGroup} isMono />
          <DetailRow icon={Droplet} label="Birth Date" value={student?.dob || "N/A"} isMono />
        </div>
      </main>

      {/* --- 3. Card Footer (QR & Address) --- */}
      <footer className=" flex items-center justify-between  print:border-slate-300 pt-2 text-[7px] text-slate-400 print:text-slate-600 font-medium shrink-0">
        <div className="flex-1 pr-2">
         
          <p className="mt-0.5 line-clamp-2 leading-tight"> {/* line-clamp-2 allows exactly 2 lines for address before truncating */}
            Loc: {student?.address || "N/A"}
          </p>
        </div>
        
        {/* QR Code Container */}
        <div className="w-18 h-18 shrink-0 bg-white rounded-md flex shadow-sm border border-slate-200">
          <img
             src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.id}`}
            alt="Attendance QR Code"
            loading="lazy"
            className="w-full h-full object-contain"
			/>
        </div>
      </footer>
 
</div>
);

// Helper component for uniform rows
const DetailRow = ({
  icon: Icon,
  label,
  value,
  isHighlight,
  isMono,
  highlightValue,
}) => (
  <div className="flex items-center justify-between border-b border-slate-800/50 print:border-slate-200 pb-1">
    <span className="text-[8px] uppercase font-bold text-slate-400 print:text-slate-500 flex items-center gap-1 shrink-0">
      <Icon size={9} className="text-teal-500 print:text-slate-600" /> {label}
    </span>
    <span
      className={`truncate max-w-[120px] text-right 
      ${isHighlight ? "font-extrabold text-white print:text-black tracking-wide" : "font-bold text-slate-200 print:text-slate-800"} 
      ${isMono ? "font-mono" : ""} 
      ${highlightValue ? "font-mono text-teal-400 print:text-slate-800" : ""}`}
    >
      {value}
    </span>
  </div>
);

// ==========================================
// MAIN COMPONENT: Page Layout & Data Fetching
// ==========================================
export default function GenerateIDCards() {
  const [targetClass, setTargetClass] = useState("Nursery");
  const [targetSection, setTargetSection] = useState("Section A");
  const [searchQuery, setSearchQuery] = useState("");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const SECTIONS = [
    "Section A",
    "Section B",
    "Section C",
    "Section D",
    "Section E",
  ];

  const loadLiveRosterFromBackend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/school/students/idCard?class=${encodeURIComponent(targetClass)}&section=${encodeURIComponent(targetSection)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setStudents(result.data);
      } else {
        setStudents([]);
        if (!result.success) setError(result.message || "Failed to load data.");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Unable to connect to the server. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [targetClass, targetSection]);

  useEffect(() => {
    loadLiveRosterFromBackend();
    setSearchQuery(""); // Reset search when class/section changes
  }, [loadLiveRosterFromBackend]);

  // Optimized Filtering Logic
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query),
    );
  }, [students, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased print:p-0 print:bg-white">
      {/* 🖨️ THE BULLETPROOF PRINT OVERRIDE STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
				@media print {
					@page {
						size: A4;
						margin: 10mm;
					}
					body * {
						visibility: hidden;
					}
					#printable-id-cards-container, 
					#printable-id-cards-container * {
						visibility: visible;
					}
					#printable-id-cards-container {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						margin: 0;
						padding: 0;
					}
				}
			`,
        }}
      />

      <div className="max-w-7xl mx-auto space-y-6 print:space-y-0">
        {/* ================= HEADER & CONTROLS ================= */}
        <div className="print:hidden space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
                <ShieldCheck size={14} /> ID Generation Module
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Generate Student ID Cards
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Fetch class rosters and generate batch CR80 Identity Cards.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              disabled={filteredStudents.length === 0 || loading}
              className="flex items-center gap-2 bg-slate-900 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={16} />
              PRINT ID CARDS
            </button>
          </div>

          {/* FILTERS & SEARCH BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Select Grade Class
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Select Section Block
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                {SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Search Student
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="By Name or Roll No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATE HANDLING & ID CARDS GRID ================= */}
        {loading && (
          <div className="p-12 text-center text-teal-600 font-bold animate-pulse print:hidden">
            Contacting cloud servers... formatting ID cards...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center justify-center gap-2 print:hidden">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200 print:hidden">
            {searchQuery
              ? `No students found matching "${searchQuery}"`
              : `No student records found for ${targetClass} - ${targetSection}.`}
          </div>
        )}

        {/* 🖨️ THE TARGET PRINT CONTAINER */}
        {!loading && filteredStudents.length > 0 && (
          <div
            id="printable-id-cards-container"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center print:grid-cols-2 print:gap-4 print:place-items-start print:w-full"
          >
            {filteredStudents.map((student) => (
              <StudentIdCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

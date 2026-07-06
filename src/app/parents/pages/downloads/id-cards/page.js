"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Printer,
  User,
  Phone,
  MapPin,
  Heart,
  Calendar,
  AlertCircle,
  Download,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function ParentIDCardViewer() {
  const { data: session, status } = useSession();

  const [students, setStudents] = useState([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIDCardData = async () => {
      if (status === "loading") return;
      if (!session?.user) {
        setError("Please login to access student credentials.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/school/parents/downloads/id-cards");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to retrieve document metadata.",
          );
        }

        setStudents(data.idCards);
      } catch (err) {
        console.error("ID Card frontend stream client error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIDCardData();
  }, [session, status]);

  // Printer trigger engine function
  const handlePrintCard = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          Generating digital ID credentials...
        </p>
      </div>
    );
  }

  if (error || students.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-2xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-red-700">Access Restricted</h2>
        <p className="text-red-600 mt-2">
          {error || "No student links allocated to this account profile."}
        </p>
      </div>
    );
  }

  const  activeStudent = students[activeChildIndex];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* 🚀 BULLETPROOF PRINT HOOK OVERRIDE STYLES (Keeps your admin print isolation intact) */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-id-card-element,
          #printable-id-card-element * {
            visibility: visible;
          }
          #printable-id-card-element {
            position: absolute;
            left: 50%;
            top: 40px;
            transform: translateX(-50%) scale(1.2);
            transform-origin: top center;
          }
          header,
          sidebar,
          nav,
          footer,
          button,
          select,
          .no-print {
            display: none !important;
          }
          body {
            background: none !important;
            background-color: white !important;
          }
        }
        @page {
          size: A4 portrait;
          margin: 0;
        }
      `}</style>

      {/* --- Action Header Panel --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-teal-600 w-6 h-6" /> Digital Identity
            Card
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Verify details and download verified student ID badge.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Multi-child select widget menu */}
          <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400 ml-2" />
            <select
              className="bg-transparent text-sm font-bold text-gray-700 focus:ring-0 outline-none cursor-pointer pr-4"
              value={activeChildIndex}
              onChange={(e) => setActiveChildIndex(Number(e.target.value))}
            >
              {students.map((child, idx) => (
                <option key={child.id} value={idx}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          {/* Master trigger print button */}
          <button
            onClick={handlePrintCard}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-teal-100 active:scale-95"
          >
            <Printer className="w-4 h-4" /> Download / Print ID
          </button>
        </div>
      </div>

      {/* --- ID Card Preview Workspace Container --- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center pt-4">
        {/* Left Side: Premium A4 Standard Alignment Mock Preview */}
        <div className="md:col-span-2 flex justify-center">
          {/* 🖨️ THE TARGET ELEMENT ENGINE BOUNDARY */}
          <div
            id="printable-id-card-element"
            className="w-[260px] h-[400px] bg-gradient-to-b from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-5 shadow-xl text-white relative flex flex-col justify-between border border-slate-700 print:shadow-none [print-color-adjust:exact]"
          >
            {/* Card Graphic Top Header */}
            <div className="text-center border-b border-slate-700/80 pb-3">
              <h4 className="text-[11px] font-black tracking-widest uppercase text-teal-400 leading-tight">
                {activeStudent.schoolName}
              </h4>
              <p className="text-[7px] tracking-wider text-slate-400 uppercase mt-1">
                Student Identity Card
              </p>
            </div>

            {/* Avatar Placement Box Wrapper */}
            <div className="my-auto flex flex-col items-center space-y-3">
              <div className="relative">
                <img
                  src={activeStudent.avatar}
                  alt="Student Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-800 bg-slate-900 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1 border-2 border-slate-800">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Identity Headers Name labels */}
              <div className="text-center">
                <h3 className="text-base font-extrabold tracking-wide text-white">
                  {activeStudent.name}
                </h3>
                <p className="text-xs font-semibold text-teal-400 mt-0.5">
                   {activeStudent.class} - {activeStudent.section}
                </p>
              </div>

              {/* Structured Metadata Information List Layout Grid */}
              <div className="w-full bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    Roll Number:
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {activeStudent.rollNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    Father's Name:
                  </span>
                  <span className="font-semibold text-slate-200">
                    {activeStudent.fatherName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    Emergency No:
                  </span>
                  <span className="font-semibold text-slate-200">
                    {activeStudent.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    Blood Group:
                  </span>
                  <span className="font-bold text-red-400">
                    {activeStudent.bloodGroup}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer with Dummy QR Reference Area */}
            <div className=" flex items-center justify-between border-t border-slate-800/80 pt-2 text-[7px] text-slate-400 font-medium">
              <div>
                <p>DOB: {activeStudent.dob}</p>
                <p className="mt-0.5 truncate max-w-[150px]">
                  Loc: {activeStudent.address}
                </p>
              </div>
              <div className="w-18 h-18 bg-white p-0.5 rounded flex items-center justify-center shadow-sm opacity-90">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${activeStudent.id}`}
                  alt="QR Code"
                  className="w-full h-full"
                />{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Informational Guide Checklist Box Description */}
        <div className="md:col-span-3 space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm no-print">
          <h3 className="text-lg font-bold text-gray-800">
            Print Instructions & Safety Guard
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <p>
                <strong>Official Validity:</strong> Yeh school authority dwara
                verify kiya hua dynamic ID card hai, jise emergency contacts aur
                transport logs ke liye digitally use kiya ja sakta hai.
              </p>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p>
                  <strong>How to Save as PDF / Print:</strong>
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-gray-500">
                  <li>
                    Top right mein <strong>Download / Print ID</strong> button
                    par click karein.
                  </li>
                  <li>
                    Destination mein <strong>Save as PDF</strong> ya apna
                    connected Printer select karein.
                  </li>
                  <li>
                    Print preferences modal mein <strong>More Settings</strong>{" "}
                    par click karke <strong>Background Graphics ☑️</strong>{" "}
                    check-box ko hamesha ON rakhein, taaki premium dark gradient
                    color perfectly print ho sake.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

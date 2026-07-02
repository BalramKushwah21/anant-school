"use client";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// ==========================================
// 1. EMBEDDED LAYOUT LAYERS (Props Driven)
// ==========================================

const CBSETemplateLayout = ({ config, student, isBuilder }) => {
  const [subjects, setSubjects] = useState(student.marks || [
    { code: "301", name: "ENGLISH CORE", th: "075", pr: "019", total: "094", grade: "A1" },
    { code: "041", name: "MATHEMATICS", th: "082", pr: "020", total: "102", grade: "A1" },
    { code: "042", name: "PHYSICS", th: "065", pr: "028", total: "093", grade: "A1" }
  ]);

  const addSubjectRow = () => {
    setSubjects([...subjects, { code: "000", name: "NEW SUBJECT", th: "00", pr: "00", total: "00", grade: "A1" }]);
  };

  const removeSubjectRow = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  return (
    <div 
      className="bg-white p-6 sm:p-10 w-[900px] min-w-[900px] mx-auto font-serif text-slate-900 border-[8px] border-double relative transition-all"
      style={{ borderColor: config.themeColor || "#b91c1c" }}
    >
      <div className="text-center mb-6">
        <h1 contentEditable={isBuilder} suppressContentEditableWarning className="text-2xl font-black uppercase tracking-wider outline-none focus:bg-yellow-50 px-2 rounded">
          {config.schoolName || "STANDARD ENTERPRISE HIGH SCHOOL"}
        </h1>
        <p contentEditable={isBuilder} suppressContentEditableWarning className="text-xs text-slate-500 font-sans tracking-wide mt-1 outline-none focus:bg-yellow-50">
          {config.tagline || "Affiliated to Central Board of Secondary Education, New Delhi"}
        </p>
        <div className="h-0.5 w-full bg-slate-800 my-2"></div>
        <h2 className="text-lg font-bold tracking-widest uppercase">MARKS STATEMENT</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm p-4 border border-slate-700 bg-slate-50/50 rounded">
        <div><span className="font-bold">STUDENT'S NAME :</span> <span className="uppercase font-medium border-b border-dashed border-slate-400 px-1">{student.name || "ARJUN KUMAR"}</span></div>
        <div><span className="font-bold">ROLL NUMBER :</span> <span className="uppercase font-medium border-b border-dashed border-slate-400 px-1">{student.rollNo || "22345678"}</span></div>
        <div><span className="font-bold">MOTHER'S NAME :</span> <span className="uppercase font-medium border-b border-dashed border-slate-400 px-1">{student.motherName || "SUNITA DEVI"}</span></div>
        <div><span className="font-bold">FATHER'S NAME :</span> <span className="uppercase font-medium border-b border-dashed border-slate-400 px-1">{student.fatherName || "RAJESH KUMAR"}</span></div>
      </div>

      <div className="border border-slate-800 rounded overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="text-white border-b border-slate-800" style={{ backgroundColor: config.themeColor || "#b91c1c" }}>
            <tr>
              <th className="p-2 border-r border-slate-700 font-bold text-center w-24">SUB CODE</th>
              <th className="p-2 border-r border-slate-700 font-bold">SUBJECT NAME</th>
              <th className="p-2 border-r border-slate-700 font-bold text-center w-20">THEORY</th>
              <th className="p-2 border-r border-slate-700 font-bold text-center w-20">PRACTICAL</th>
              <th className="p-2 border-r border-slate-700 font-bold text-center w-24">TOTAL</th>
              <th className="p-2 font-bold text-center w-20">GRADE</th>
              {isBuilder && <th className="p-2 text-center w-12 print:hidden bg-slate-800/20">DEL</th>}
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, idx) => (
              <tr key={idx} className="border-b border-slate-300 hover:bg-slate-50/80 transition-colors group relative">
                <td contentEditable={isBuilder} suppressContentEditableWarning className="p-2 border-r border-slate-300 text-center font-bold outline-none focus:bg-blue-50">{sub.code}</td>
                <td contentEditable={isBuilder} suppressContentEditableWarning className="p-2 border-r border-slate-300 font-bold uppercase outline-none focus:bg-blue-50">{sub.name}</td>
                <td contentEditable={isBuilder} suppressContentEditableWarning className="p-2 border-r border-slate-300 text-center outline-none focus:bg-blue-50">{sub.th}</td>
                <td contentEditable={isBuilder} suppressContentEditableWarning className="p-2 border-r border-slate-300 text-center outline-none focus:bg-blue-50">{sub.pr}</td>
                <td contentEditable={isBuilder} suppressContentEditableWarning className="p-2 border-r border-slate-300 text-center font-black outline-none focus:bg-blue-100">{sub.total}</td>
                <td contentEditable={isBuilder} suppressContentEditableWarning className="p-2 text-center font-bold outline-none focus:bg-blue-50">{sub.grade}</td>
                {isBuilder && (
                  <td className="p-1 text-center print:hidden border-l border-slate-200">
                    <button onClick={() => removeSubjectRow(idx)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 active:scale-95 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isBuilder && (
          <div className="p-2 bg-slate-50 flex justify-center print:hidden border-t border-slate-300">
            <button onClick={addSubjectRow} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 border border-indigo-200 rounded shadow-sm active:scale-95 transition-all">
              <Plus size={14} /> Add Row
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center font-bold text-sm">
        <div>RESULT: <span className="uppercase text-green-700 px-1 border-b border-slate-400">PASS</span></div>
        <div>DATE: <span className="uppercase font-medium border-b border-slate-400 px-1">27-06-2026</span></div>
      </div>

      <div className="mt-14 flex justify-between items-end text-xs font-bold tracking-wide">
        <div className="text-center w-44 border-t border-slate-400 pt-1">Class Teacher Signature</div>
        <div className="text-center w-44 border-t border-slate-400 pt-1">Controller of Examinations</div>
      </div>
    </div>
  );
};

const ModernTemplateLayout = ({ config, student, isBuilder }) => {
  return (
    <div className="bg-white p-8 w-[900px] min-w-[900px] mx-auto font-sans text-slate-800 border rounded-xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: config.themeColor || "#0f766e" }}></div>
      <div className="flex justify-between items-start mb-6 mt-2">
        <div className="text-left">
          <h1 contentEditable={isBuilder} suppressContentEditableWarning className="text-2xl font-black tracking-tight uppercase outline-none focus:bg-slate-100 rounded">
            {config.schoolName || "MODERN PUBLIC ACADEMY"}
          </h1>
          <p contentEditable={isBuilder} suppressContentEditableWarning className="text-xs text-slate-500 font-medium outline-none focus:bg-slate-100 rounded mt-0.5">
            {config.tagline || "Global Standards of Quality Education"}
          </p>
        </div>
        <div className="text-right bg-slate-100 border px-3 py-1.5 rounded-lg">
          <span className="text-xs font-black block tracking-wider uppercase text-slate-500">Report Card</span>
          <span className="text-sm font-bold text-slate-800">Session 2026-27</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 grid grid-cols-3 gap-y-3 gap-x-6 text-sm mb-6 font-medium">
        <div><span className="text-slate-400 font-bold">NAME:</span> <span className="text-slate-800 font-bold ml-1">{student.name || "RAHUL SHARMA"}</span></div>
        <div><span className="text-slate-400 font-bold">ROLL NO:</span> <span className="text-slate-800 font-bold ml-1">{student.rollNo || "105"}</span></div>
        <div><span className="text-slate-400 font-bold">CLASS:</span> <span className="text-slate-800 font-bold ml-1">10th Standard</span></div>
        <div className="col-span-3 h-px bg-slate-200"></div>
        <div><span className="text-slate-400 font-bold">MOTHER:</span> <span className="text-slate-700 ml-1">{student.motherName || "KIRAN SHARMA"}</span></div>
        <div><span className="text-slate-400 font-bold">FATHER:</span> <span className="text-slate-700 ml-1">{student.fatherName || "MANOJ SHARMA"}</span></div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="text-white text-xs tracking-wider uppercase font-bold" style={{ backgroundColor: config.themeColor || "#0f766e" }}>
            <tr>
              <th className="p-3">Subject</th>
              <th className="p-3 text-center">Theory (80)</th>
              <th className="p-3 text-center">Practical (20)</th>
              <th className="p-3 text-center">Total (100)</th>
              <th className="p-3 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {(student.marks || [
              { name: "MATHEMATICS", th: "72", pr: "19", total: "91" },
              { name: "SCIENCE", th: "65", pr: "18", total: "83" },
              { name: "SOCIAL SCIENCE", th: "68", pr: "20", total: "88" }
            ]).map((sub, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-bold text-slate-700 uppercase">{sub.name}</td>
                <td className="p-3 text-center text-slate-600">{sub.th}</td>
                <td className="p-3 text-center text-slate-600">{sub.pr}</td>
                <td className="p-3 text-center font-black text-slate-800">{sub.total}</td>
                <td className="p-3 text-center text-xs text-emerald-600 font-bold">EXCELLENT</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 flex justify-between items-center px-4">
        <div className="text-center border-t border-slate-300 pt-1.5 w-40 text-xs font-bold text-slate-500 uppercase tracking-widest">Principal Sign</div>
        <div className="text-center border-t border-slate-300 pt-1.5 w-40 text-xs font-bold text-slate-500 uppercase tracking-widest">Teacher Sign</div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN REGISTRY WRAPPER COMPONENT
// ==========================================

export default function MarksheetRenderer({ templateType = "cbse", templateConfig = {}, studentData = {}, isBuilderMode = false }) {
  // Safe validation fallback data objects layer for system processing pipeline
  const fallbackConfig = {
    schoolName: templateConfig.schoolName || "",
    tagline: templateConfig.tagline || "",
    themeColor: templateConfig.themeColor || ""
  };

  const fallbackStudent = {
    name: studentData.name || "",
    rollNo: studentData.rollNo || "",
    motherName: studentData.motherName || "",
    fatherName: studentData.fatherName || "",
    marks: studentData.marks || null
  };

  if (templateType === "modern") {
    return <ModernTemplateLayout config={fallbackConfig} student={fallbackStudent} isBuilder={isBuilderMode} />;
  }

  // Default fallback engine component allocation
  return <CBSETemplateLayout config={fallbackConfig} student={fallbackStudent} isBuilder={isBuilderMode} />;
}
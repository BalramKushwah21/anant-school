"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, PlusCircle, LayoutTemplate, Settings2 } from "lucide-react";

export default function CBSETemplate() {
  // 🗄️ MASTER JSON CONFIGURATION (Saves to Database)
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_ultimate_001",
    templateName: "CBSE / State Board Custom Layout",
    themeColor: "#b91c1c", // Default Red/Maroon
    header: {
      schoolName: "CAMBRIDGE PUBLIC SCHOOL",
      tagline: "A Senior Secondary Co-Education School",
      affiliation: "Affiliated to C.B.S.E., New Delhi",
      address: "Sector-12, Phase-II, XYZ City",
      phone: "Ph: 011-23456789 | Email: info@cambridge.edu",
    },
    // DYNAMIC EXAMS/TERMS (Supports 2, 3, or N terms)
    terms: [
      {
        id: "term_1",
        title: "Term I (100 Marks)",
        subCols: [
          { id: "sc_1_1", title: "Per Test (10)" },
          { id: "sc_1_2", title: "Note Bk (5)" },
          { id: "sc_1_3", title: "Sub Enrich (5)" },
          { id: "sc_1_4", title: "Half Yrly (80)" },
        ]
      },
      {
        id: "term_2",
        title: "Term II (100 Marks)",
        subCols: [
          { id: "sc_2_1", title: "Per Test (10)" },
          { id: "sc_2_2", title: "Note Bk (5)" },
          { id: "sc_2_3", title: "Sub Enrich (5)" },
          { id: "sc_2_4", title: "Yearly (80)" },
        ]
      }
    ],
    // DYNAMIC SUBJECTS (Rows)
    scholasticSubjects: [
      { id: "sub_1", name: "English" },
      { id: "sub_2", name: "Hindi" },
      { id: "sub_3", name: "Mathematics" },
      { id: "sub_4", name: "Science" },
      { id: "sub_5", name: "Social Science" },
    ],
    coScholasticSubjects: [
      { id: "co_1", name: "Life Skills" },
      { id: "co_2", name: "Work Education" },
      { id: "co_3", name: "Visual and Performing Arts" },
    ],
    footer: {
      remarksLabel: "Class Teacher's Remarks:",
      signatures: ["Class Teacher", "Principal", "Parent"]
    }
  });

  // ================= ACTION HANDLERS =================

  const handleHeaderChange = (field, value) => {
    setTemplateConfig({ ...templateConfig, header: { ...templateConfig.header, [field]: value } });
  };

  // --- ROWS (Subjects) LOGIC ---
  const addSubject = (type) => {
    const newSub = { id: `sub_${Date.now()}`, name: "New Subject" };
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, scholasticSubjects: [...templateConfig.scholasticSubjects, newSub] });
    } else {
      setTemplateConfig({ ...templateConfig, coScholasticSubjects: [...templateConfig.coScholasticSubjects, newSub] });
    }
  };

  const updateSubject = (type, id, value) => {
    if (type === 'scholastic') {
      setTemplateConfig({
        ...templateConfig,
        scholasticSubjects: templateConfig.scholasticSubjects.map(s => s.id === id ? { ...s, name: value } : s)
      });
    } else {
      setTemplateConfig({
        ...templateConfig,
        coScholasticSubjects: templateConfig.coScholasticSubjects.map(s => s.id === id ? { ...s, name: value } : s)
      });
    }
  };

  const removeSubject = (type, id) => {
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, scholasticSubjects: templateConfig.scholasticSubjects.filter(s => s.id !== id) });
    } else {
      setTemplateConfig({ ...templateConfig, coScholasticSubjects: templateConfig.coScholasticSubjects.filter(s => s.id !== id) });
    }
  };

  // --- COLUMNS (Terms & Exams) LOGIC ---
  const addTerm = () => {
    const newTerm = {
      id: `term_${Date.now()}`,
      title: "New Term (100)",
      subCols: [
        { id: `sc_${Date.now()}_1`, title: "Marks (100)" },
        { id: `sc_${Date.now()}_2`, title: "Grade" }
      ]
    };
    setTemplateConfig({ ...templateConfig, terms: [...templateConfig.terms, newTerm] });
  };

  const removeTerm = (termId) => {
    setTemplateConfig({ ...templateConfig, terms: templateConfig.terms.filter(t => t.id !== termId) });
  };

  const updateTermTitle = (termId, value) => {
    setTemplateConfig({
      ...templateConfig,
      terms: templateConfig.terms.map(t => t.id === termId ? { ...t, title: value } : t)
    });
  };

  const addSubCol = (termId) => {
    const newSubCol = { id: `sc_${Date.now()}`, title: "New Col" };
    setTemplateConfig({
      ...templateConfig,
      terms: templateConfig.terms.map(t => 
        t.id === termId ? { ...t, subCols: [...t.subCols, newSubCol] } : t
      )
    });
  };

  const removeSubCol = (termId, scId) => {
    setTemplateConfig({
      ...templateConfig,
      terms: templateConfig.terms.map(t => 
        t.id === termId ? { ...t, subCols: t.subCols.filter(sc => sc.id !== scId) } : t
      )
    });
  };

  const updateSubColTitle = (termId, scId, value) => {
    setTemplateConfig({
      ...templateConfig,
      terms: templateConfig.terms.map(t => 
        t.id === termId ? {
          ...t, subCols: t.subCols.map(sc => sc.id === scId ? { ...sc, title: value } : sc)
        } : t
      )
    });
  };

  const handleSave = () => {
    console.log("Saving Ultimate Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("Template Structure Saved! This JSON covers all dynamic rows and columns for mapping.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-indigo-600"/>
            <span className="font-bold text-lg">Master Layout Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Click any text to edit • Hover over rows/cols to Add or Delete</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <label className="text-xs font-bold text-slate-600">Theme:</label>
             <input type="color" value={templateConfig.themeColor} onChange={(e) => setTemplateConfig({...templateConfig, themeColor: e.target.value})} className="w-6 h-6 rounded cursor-pointer border-none p-0"/>
          </div>
          <button onClick={addTerm} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-200">
            <PlusCircle size={16} /> Add 3rd Term
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[12mm] relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center border-b-[4px] pb-5 mb-6" style={{ borderColor: templateConfig.themeColor }}>
          
          <div className="w-28 h-28 border-2 border-dashed border-slate-300 flex items-center justify-center rounded-xl bg-slate-50 group relative cursor-pointer hover:bg-slate-100 transition-all">
             <ImageIcon size={28} className="text-slate-400 group-hover:hidden" />
             <span className="hidden group-hover:block text-[10px] font-bold text-slate-500 text-center px-2">Click to Upload Logo</span>
          </div>

          <div className="flex-1 text-center px-6">
            <input type="text" value={templateConfig.header.schoolName} onChange={(e) => handleHeaderChange('schoolName', e.target.value)}
              className="w-full text-4xl font-black uppercase text-center outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 ring-blue-100 rounded transition-all tracking-wider"
              style={{ color: templateConfig.themeColor }} />
            <input type="text" value={templateConfig.header.tagline} onChange={(e) => handleHeaderChange('tagline', e.target.value)}
              className="w-full text-sm font-bold text-center outline-none mt-2 hover:bg-slate-50 text-slate-700 uppercase tracking-widest" />
            <input type="text" value={templateConfig.header.affiliation} onChange={(e) => handleHeaderChange('affiliation', e.target.value)}
              className="w-full text-xs text-center outline-none hover:bg-slate-50 text-slate-600 font-semibold mt-1" />
            <input type="text" value={templateConfig.header.address} onChange={(e) => handleHeaderChange('address', e.target.value)}
              className="w-full text-xs text-center outline-none hover:bg-slate-50 text-slate-500 mt-1" />
            <input type="text" value={templateConfig.header.phone} onChange={(e) => handleHeaderChange('phone', e.target.value)}
              className="w-full text-xs text-center outline-none hover:bg-slate-50 text-slate-500 mt-0.5" />
          </div>

          <div className="w-28 h-36 border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-xs text-slate-400 font-semibold text-center p-2 rounded shadow-inner">
            [Student Photo DB Map]
          </div>
        </div>

        <div className="text-center mb-8">
          <span contentEditable suppressContentEditableWarning className="border-[3px] px-8 py-2 font-black uppercase tracking-widest text-sm rounded-full bg-slate-50 shadow-sm" style={{ borderColor: templateConfig.themeColor, color: templateConfig.themeColor }}>
            Achievement Record / Progress Report
          </span>
        </div>

        {/* STUDENT INFO PLACEHOLDERS */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8 text-sm font-semibold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex border-b border-slate-300 pb-1"><span className="w-36 text-slate-500">Student's Name:</span> <span className="text-slate-800 uppercase">{'{{student.name}}'}</span></div>
          <div className="flex border-b border-slate-300 pb-1"><span className="w-36 text-slate-500">Roll No:</span> <span className="text-slate-800">{'{{student.rollNo}}'}</span></div>
          <div className="flex border-b border-slate-300 pb-1"><span className="w-36 text-slate-500">Mother's Name:</span> <span className="text-slate-800">{'{{student.motherName}}'}</span></div>
          <div className="flex border-b border-slate-300 pb-1"><span className="w-36 text-slate-500">Class & Sec:</span> <span className="text-slate-800">{'{{student.class}}'}</span></div>
          <div className="flex border-b border-slate-300 pb-1"><span className="w-36 text-slate-500">Father's Name:</span> <span className="text-slate-800">{'{{student.fatherName}}'}</span></div>
          <div className="flex border-b border-slate-300 pb-1"><span className="w-36 text-slate-500">Date of Birth:</span> <span className="text-slate-800">{'{{student.dob}}'}</span></div>
        </div>

        {/* ===================== DYNAMIC SCHOLASTIC TABLE ===================== */}
        <div className="mb-8 relative group">
          <div className="bg-slate-100 font-bold p-2.5 text-sm border-2 border-b-0 border-slate-800 flex justify-between items-center rounded-t-lg">
            <span contentEditable suppressContentEditableWarning className="uppercase tracking-wider">Part 1: Scholastic Area</span>
            <button onClick={() => addSubject('scholastic')} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:opacity-100 print:hidden flex items-center gap-1 hover:bg-indigo-700 transition-all"><Plus size={14}/> Add Subject</button>
          </div>
          
          <table className="w-full border-collapse border-2 border-slate-800 text-[11px] text-center">
            <thead>
              {/* Row 1: Terms */}
              <tr className="bg-slate-50">
                <th className="border-2 border-slate-800 p-2 w-[22%] text-left font-bold uppercase" rowSpan="2">Subjects</th>
                {templateConfig.terms.map((term) => (
                  <th key={term.id} colSpan={term.subCols.length} className="border-2 border-slate-800 p-1 relative group/term hover:bg-slate-100 transition-colors">
                     <div className="flex items-center justify-center">
                       <input type="text" value={term.title} onChange={(e) => updateTermTitle(term.id, e.target.value)} className="w-[80%] text-center outline-none bg-transparent font-bold text-xs uppercase"/>
                     </div>
                     {/* Term Controls (Hidden in Print) */}
                     <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 group-hover/term:opacity-100 print:hidden z-10">
                        <button onClick={() => addSubCol(term.id)} className="bg-blue-500 text-white p-1.5 rounded shadow hover:bg-blue-600" title="Add Column to this Term"><Plus size={12}/></button>
                        <button onClick={() => removeTerm(term.id)} className="bg-red-500 text-white p-1.5 rounded shadow hover:bg-red-600" title="Delete Entire Term"><Trash2 size={12}/></button>
                     </div>
                  </th>
                ))}
              </tr>
              {/* Row 2: Sub-columns (Exams) */}
              <tr className="bg-slate-50 font-semibold text-[10px]">
                {templateConfig.terms.map((term) => (
                  term.subCols.map((sc) => (
                    <th key={sc.id} className="border border-slate-800 p-1 relative group/sc hover:bg-slate-200">
                      <input type="text" value={sc.title} onChange={(e) => updateSubColTitle(term.id, sc.id, e.target.value)} className="w-full text-center outline-none bg-transparent"/>
                      <button onClick={() => removeSubCol(term.id, sc.id)} className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 p-1 rounded-full shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden z-10"><Trash2 size={10}/></button>
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Data Rows */}
              {templateConfig.scholasticSubjects.map((sub) => (
                <tr key={sub.id} className="group/row hover:bg-slate-50 transition-colors">
                  <td className="border-2 border-slate-800 p-1.5 text-left relative flex items-center h-full">
                    <button onClick={() => removeSubject('scholastic', sub.id)} className="absolute -left-7 bg-red-100 text-red-600 p-1.5 rounded shadow-sm  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden transition-opacity"><Trash2 size={14}/></button>
                    <input type="text" value={sub.name} onChange={(e) => updateSubject('scholastic', sub.id, e.target.value)} className="w-full outline-none px-1 font-bold text-slate-800 bg-transparent text-xs"/>
                  </td>
                  {/* Dynamic Placeholder Generation based on exact columns */}
                  {templateConfig.terms.map((term) => (
                    term.subCols.map((sc) => (
                      <td key={`${sub.id}-${sc.id}`} className="border border-slate-800 p-1.5 text-slate-400 font-mono text-[10px] bg-white group-hover/row:bg-slate-50 cursor-pointer">
                        {'{{db}}'}
                      </td>
                    ))
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== CO-SCHOLASTIC & ATTENDANCE ===================== */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          
          {/* Co-Scholastic Area */}
          <div className="relative group">
            <div className="bg-slate-100 font-bold p-2 text-sm border-2 border-b-0 border-slate-800 flex justify-between items-center rounded-t-lg">
              <span contentEditable suppressContentEditableWarning className="uppercase tracking-wider">Part 2: Co-Scholastic</span>
              <button onClick={() => addSubject('coscholastic')} className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden flex items-center gap-1"><Plus size={12}/> Add</button>
            </div>
            <table className="w-full border-collapse border-2 border-slate-800 text-[11px] text-left bg-white">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-800 p-1.5 font-bold uppercase">Activity</th>
                  <th className="border border-slate-800 p-1.5 w-20 text-center font-bold uppercase">Grade</th>
                </tr>
              </thead>
              <tbody>
                {templateConfig.coScholasticSubjects.map((sub) => (
                  <tr key={sub.id} className="group/row hover:bg-slate-50">
                    <td className="border border-slate-800 p-1 relative flex items-center h-full">
                      <button onClick={() => removeSubject('coscholastic', sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-1 rounded-full opacity-100 group-hover/row:opacity-100 print:hidden"><Trash2 size={12}/></button>
                      <input type="text" value={sub.name} onChange={(e) => updateSubject('coscholastic', sub.id, e.target.value)} className="w-full outline-none px-1 font-semibold text-slate-700 bg-transparent"/>
                    </td>
                    <td className="border border-slate-800 p-1 text-center text-slate-400 font-mono">{'{{grd}}'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance & Discipline */}
          <div className="flex flex-col gap-4">
             <div>
                <div contentEditable suppressContentEditableWarning className="bg-slate-100 font-bold p-2 text-sm border-2 border-b-0 border-slate-800 rounded-t-lg uppercase tracking-wider">Part 3: Discipline</div>
                <table className="w-full border-collapse border-2 border-slate-800 text-[11px] text-left bg-white">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-800 p-1.5 font-bold uppercase">Term / Session</th>
                      <th className="border border-slate-800 p-1.5 w-20 text-center font-bold uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templateConfig.terms.map(t => (
                      <tr key={`disc_${t.id}`}>
                        <td className="border border-slate-800 p-1.5 font-semibold px-2 text-slate-700">{t.title}</td>
                        <td className="border border-slate-800 p-1.5 text-center text-slate-400 font-mono">{'{{grd}}'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
             
             {/* Simple Attendance Box */}
             <div className="border-2 border-slate-800 p-3 bg-white rounded-lg flex justify-between items-center text-sm">
                <span className="font-bold text-slate-800 uppercase">Total Attendance:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-4 py-1 rounded border border-indigo-200">{'{{db.attendance}}'} / {'{{db.totalDays}}'}</span>
             </div>
          </div>
        </div>

        {/* ===================== FOOTER / SIGNATURES ===================== */}
        <div className="border-2 border-slate-800 p-4 text-sm mb-16 rounded-xl bg-slate-50/50 min-h-[100px]">
          <input type="text" value={templateConfig.footer.remarksLabel} onChange={(e) => setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, remarksLabel: e.target.value}})} className="font-bold text-slate-800 bg-transparent outline-none w-[300px] border-b border-transparent hover:border-slate-300 focus:border-indigo-500 transition-colors" />
          <p className="text-slate-400 italic mt-3 border-b border-dashed border-slate-400 pb-1">{'{{ Backend Database Remark Will Populate Here based on teacher input }}'}</p>
        </div>

        <div className="flex justify-between items-end px-12 font-bold text-sm">
          {templateConfig.footer.signatures.map((sig, idx) => (
             <div key={idx} className="relative group">
                <input type="text" value={sig} onChange={(e) => {
                  const newSigs = [...templateConfig.footer.signatures];
                  newSigs[idx] = e.target.value;
                  setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, signatures: newSigs}});
                }} className="border-t-2 border-slate-800 pt-2 w-48 text-center bg-transparent outline-none hover:bg-slate-100 uppercase tracking-widest text-slate-700" />
             </div>
          ))}
        </div>

      </div>
    </div>
  );
}
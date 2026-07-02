"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Settings2, PlusCircle } from "lucide-react";

export default function ConventTemplate() { // Note: Renamed back to CertificateTemplate for clarity
  // 🗄️ MASTER JSON CONFIGURATION
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_cert_001",
    templateName: "Certificate Style Layout",
    theme: {
      headerText: "#1e3a8a", // Dark Blue
      tableBorder: "#38bdf8", // Light Blue
      coScholasticBg: "#fef08a", // Yellow/Orange tint
      disciplineBg: "#bae6fd", // Light cyan
    },
    header: {
      schoolName: "SAINT HAIDER CONVENT SCHOOL",
      affiliation: "Affiliated to M. P. Board / Affiliation No. : 23190620217",
      contact: "Ph. : 07422-467955, Email : sainthaider.mandsaur@gmail.com",
      title: "Academic Record",
      session: "Academic Session - 2022-23",
      classText: "Class : ........................",
    },
    // DYNAMIC SCHOLASTIC TERMS & COLUMNS
    terms: [
      {
        id: "term_1",
        title: "Term I (100 Marks)",
        cols: [
          { id: "c1", name: "Oral" },
          { id: "c2", name: "Half Yearly" },
          { id: "c3", name: "Total" },
        ]
      },
      {
        id: "term_2",
        title: "Term II (100 Marks)",
        cols: [
          { id: "c4", name: "Note Book" },
          { id: "c5", name: "Oral" },
          { id: "c6", name: "Yearly Exam" },
          { id: "c7", name: "Total" },
        ]
      }
    ],
    overallCols: [
      { id: "o1", name: "Grand Total" },
      { id: "o2", name: "Grade" },
    ],
    subjects: [
      { id: "s1", name: "English" },
      { id: "s2", name: "Hindi" },
      { id: "s3", name: "Maths" },
      { id: "s4", name: "EVS" },
      { id: "s5", name: "URDU" },
    ],
    summaryBoxes: [
      { id: "b1", label: "Over All Marks", color: "#16a34a", hex: "green" },
      { id: "b2", label: "Percentage", color: "#dc2626", hex: "red" },
      { id: "b3", label: "Grade", color: "#1e3a8a", hex: "blue" },
      { id: "b4", label: "Rank", color: "#db2777", hex: "pink" },
    ],
    coSchooling: [
      { id: "cs1", name: "Work Education" },
      { id: "cs2", name: "Art Education" },
      { id: "cs3", name: "Health Physical Education" },
      { id: "cs4", name: "Social Skills" },
      { id: "cs5", name: "Sports" },
    ],
    discipline: [
      { id: "d1", name: "Regularity & Punctuality" },
      { id: "d2", name: "Sincerity" },
      { id: "d3", name: "Behaviour & Values" },
      { id: "d4", name: "Respectfulness for Rules & Reg." },
      { id: "d5", name: "Attitude Towards Teachers" },
      { id: "d6", name: "Attitude Towards Society" },
    ],
    footer: {
      promotionText: "Congratulation ! Promoted to Class - ........................",
      signatures: ["Class Teacher's Signature", "Principal's Signature"]
    }
  });

  // ================= ACTION HANDLERS =================

  const updateHeader = (field, value) => {
    setTemplateConfig({ ...templateConfig, header: { ...templateConfig.header, [field]: value } });
  };

  const addSubject = (type) => {
    const newId = `item_${Date.now()}`;
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, subjects: [...templateConfig.subjects, { id: newId, name: "New Subject" }] });
    } else if (type === 'coschooling') {
      setTemplateConfig({ ...templateConfig, coSchooling: [...templateConfig.coSchooling, { id: newId, name: "New Activity" }] });
    } else if (type === 'discipline') {
      setTemplateConfig({ ...templateConfig, discipline: [...templateConfig.discipline, { id: newId, name: "New Parameter" }] });
    }
  };

  const removeRow = (type, id) => {
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.filter(s => s.id !== id) });
    } else if (type === 'coschooling') {
      setTemplateConfig({ ...templateConfig, coSchooling: templateConfig.coSchooling.filter(s => s.id !== id) });
    } else if (type === 'discipline') {
      setTemplateConfig({ ...templateConfig, discipline: templateConfig.discipline.filter(s => s.id !== id) });
    }
  };

  const updateRow = (type, id, value) => {
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.map(s => s.id === id ? { ...s, name: value } : s) });
    } else if (type === 'coschooling') {
      setTemplateConfig({ ...templateConfig, coSchooling: templateConfig.coSchooling.map(s => s.id === id ? { ...s, name: value } : s) });
    } else if (type === 'discipline') {
      setTemplateConfig({ ...templateConfig, discipline: templateConfig.discipline.map(s => s.id === id ? { ...s, name: value } : s) });
    }
  };

  const handleSave = () => {
    console.log("Saving Certificate Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("✨ Certificate Template Saved! Ready for database merging.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-indigo-600"/>
            <span className="font-bold text-lg">Certificate Format Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Click text to edit • Hover over rows to add/delete</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => addSubject('scholastic')} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-200">
            <PlusCircle size={16} /> Add Subject
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
            <Save size={16} /> Save Format
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[10mm] relative">
        
        {/* Certificate Border (Guilloche Simulation) */}
        <div className="w-full h-full border-[10px] border-double p-6 relative flex flex-col bg-white" style={{ borderColor: '#64748b', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
          
          {/* HEADER SECTION */}
          <div className="text-center mb-6 relative">
            <div className="absolute left-0 top-16 w-24 h-24 border-2 border-slate-300 rounded-full flex flex-col items-center justify-center bg-slate-50 shadow-inner group cursor-pointer hover:bg-slate-100">
               <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">DB LOGO</span>
            </div>

            <input type="text" value={templateConfig.header.schoolName} onChange={(e) => updateHeader('schoolName', e.target.value)}
              className="w-full text-[28px] font-serif font-bold uppercase text-center outline-none bg-transparent tracking-wide"
              style={{ color: templateConfig.theme.headerText }} />
            
            <input type="text" value={templateConfig.header.affiliation} onChange={(e) => updateHeader('affiliation', e.target.value)}
              className="w-full text-xs text-center outline-none bg-transparent mt-1 text-slate-700"/>
            
            <input type="text" value={templateConfig.header.contact} onChange={(e) => updateHeader('contact', e.target.value)}
              className="w-full text-[11px] text-center outline-none bg-transparent italic text-slate-600"/>

            <div className="mt-4">
              <input type="text" value={templateConfig.header.title} onChange={(e) => updateHeader('title', e.target.value)}
                className="w-full text-2xl font-serif text-center outline-none bg-transparent"
                style={{ color: templateConfig.theme.headerText }}/>
              <input type="text" value={templateConfig.header.session} onChange={(e) => updateHeader('session', e.target.value)}
                className="w-full text-sm text-center outline-none bg-transparent font-semibold text-slate-700 mt-1"/>
              <input type="text" value={templateConfig.header.classText} onChange={(e) => updateHeader('classText', e.target.value)}
                className="w-full text-sm text-center outline-none bg-transparent font-medium text-slate-700 mt-1"/>
            </div>
          </div>

          {/* STUDENT INFO BOX (2 Columns) */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-6 text-sm text-slate-700" style={{ color: templateConfig.theme.headerText }}>
            <div className="flex border-b border-dotted border-slate-400 pb-0.5">
               <span className="w-32 font-medium">Name of Student</span>
               <span className="flex-1 text-slate-800 font-mono text-xs pt-1 uppercase">{'{{student.name}}'}</span>
            </div>
            <div className="flex border-b border-dotted border-slate-400 pb-0.5">
               <span className="w-24 font-medium">Roll No.</span>
               <span className="flex-1 text-slate-800 font-mono text-xs pt-1">{'{{student.rollNo}}'}</span>
            </div>
            <div className="flex border-b border-dotted border-slate-400 pb-0.5">
               <span className="w-32 font-medium">Mother's Name</span>
               <span className="flex-1 text-slate-800 font-mono text-xs pt-1 uppercase">{'{{student.motherName}}'}</span>
            </div>
            <div className="flex border-b border-dotted border-slate-400 pb-0.5">
               <span contentEditable suppressContentEditableWarning className="w-24 font-medium">Scholar No.</span>
               <span className="flex-1 text-slate-800 font-mono text-xs pt-1">{'{{student.scholarNo}}'}</span>
            </div>
            <div className="flex border-b border-dotted border-slate-400 pb-0.5">
               <span className="w-32 font-medium">Father's Name</span>
               <span className="flex-1 text-slate-800 font-mono text-xs pt-1 uppercase">{'{{student.fatherName}}'}</span>
            </div>
            <div className="flex border-b border-dotted border-slate-400 pb-0.5">
               <span className="w-24 font-medium">Date of Birth</span>
               <span className="flex-1 text-slate-800 font-mono text-xs pt-1">{'{{student.dob}}'}</span>
            </div>
          </div>

          {/* ===================== SCHOLASTIC TABLE ===================== */}
          <div className="mb-6 relative group border-2" style={{ borderColor: templateConfig.theme.headerText }}>
            <table className="w-full border-collapse text-[11px] text-center font-medium bg-white">
              <thead>
                <tr style={{ color: templateConfig.theme.headerText }}>
                  <th className="p-1.5 text-left border-r border-b" rowSpan="2" style={{ borderColor: templateConfig.theme.tableBorder }}>Scholastic Area<br/><span className="text-[13px] font-bold">Subjects</span></th>
                  
                  {templateConfig.terms.map((term) => (
                    <th key={term.id} colSpan={term.cols.length} className="p-1 border-b border-r" style={{ borderColor: templateConfig.theme.tableBorder }}>
                      {/* 🛠️ FIX 1: Added onChange here */}
                      <input 
                        type="text" 
                        value={term.title} 
                        onChange={(e) => {
                          const updatedTerms = templateConfig.terms.map(t => t.id === term.id ? { ...t, title: e.target.value } : t);
                          setTemplateConfig({ ...templateConfig, terms: updatedTerms });
                        }}
                        className="w-full text-center outline-none bg-transparent font-semibold"
                      />
                    </th>
                  ))}
                  
                  <th colSpan={templateConfig.overallCols.length} className="p-1 border-b" style={{ borderColor: templateConfig.theme.tableBorder }}>Over All</th>
                </tr>
                <tr style={{ color: templateConfig.theme.headerText }}>
                  {templateConfig.terms.map((term) => (
                    term.cols.map((col) => (
                       <th key={col.id} className="p-1 border-b border-r w-12" style={{ borderColor: templateConfig.theme.tableBorder }}>{col.name}</th>
                    ))
                  ))}
                  {templateConfig.overallCols.map((col, idx) => (
                     <th key={col.id} className={`p-1 border-b w-12 ${idx===0 ? 'border-r' : ''}`} style={{ borderColor: templateConfig.theme.tableBorder }}>{col.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {templateConfig.subjects.map((sub) => (
                  <tr key={sub.id} className="group/row hover:bg-slate-50 relative">
                    <td className="p-1.5 border-r text-left relative flex items-center" style={{ borderColor: templateConfig.theme.tableBorder, color: templateConfig.theme.headerText }}>
                      <button onClick={() => removeRow('scholastic', sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 group-hover/row:opacity-100 print:hidden"><Trash2 size={12}/></button>
                      <input type="text" value={sub.name} onChange={(e) => updateRow('scholastic', sub.id, e.target.value)} className="w-full outline-none bg-transparent font-semibold text-[13px]"/>
                    </td>
                    
                    {/* Database Placeholders Loop */}
                    {templateConfig.terms.map((term) => (
                      term.cols.map((col) => (
                        <td key={`${sub.id}_${col.id}`} className="p-1.5 border-r font-mono text-[10px] text-slate-400" style={{ borderColor: templateConfig.theme.tableBorder }}>{'{{db}}'}</td>
                      ))
                    ))}
                    {templateConfig.overallCols.map((col, idx) => (
                        <td key={`${sub.id}_${col.id}`} className={`p-1.5 font-mono text-[10px] text-slate-600 font-bold ${idx===0 ? 'border-r' : ''}`} style={{ borderColor: templateConfig.theme.tableBorder }}>{'{{calc}}'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================== MIDDLE SUMMARY BOXES ===================== */}
          <div className="flex justify-between items-center mb-6 gap-2">
            {templateConfig.summaryBoxes.map((box) => (
               <div key={box.id} className="flex border shadow-sm w-1/4 bg-white" style={{ borderColor: box.color }}>
                  <div className="text-white text-[10px] font-bold px-2 py-1.5 text-center flex-1" style={{ backgroundColor: box.color }}>
                    {/* 🛠️ FIX 2: Added onChange here */}
                    <input 
                      type="text" 
                      value={box.label} 
                      onChange={(e) => {
                        const updatedBoxes = templateConfig.summaryBoxes.map(b => b.id === box.id ? { ...b, label: e.target.value } : b);
                        setTemplateConfig({ ...templateConfig, summaryBoxes: updatedBoxes });
                      }}
                      className="w-full text-center outline-none bg-transparent uppercase tracking-wider"
                    />
                  </div>
                  <div className="w-12 bg-white flex items-center justify-center font-mono text-xs font-bold" style={{ color: box.color }}>{'{{db}}'}</div>
               </div>
            ))}
          </div>

          {/* ===================== CO-SCHOLASTIC & DISCIPLINE TABLES ===================== */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            
            {/* Left Table: Co-Schooling */}
            <div className="relative group">
               <button onClick={() => addSubject('coschooling')} className="absolute -left-2 -top-6 text-xs text-indigo-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden flex items-center gap-1 font-bold"><Plus size={14}/> Add Activity</button>
               <table className="w-full border-collapse border border-slate-400 text-[11px] bg-white">
                 <thead>
                   <tr>
                     <th colSpan="2" className="p-1.5 text-center text-white font-bold tracking-wider" style={{ background: 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)' }}>CO-SCHOOLING AREA</th>
                   </tr>
                   <tr className="bg-orange-50 border-b border-slate-400" style={{ color: templateConfig.theme.headerText }}>
                     <th className="p-1.5 text-left border-r border-slate-400 w-[75%]">Activity</th>
                     <th className="p-1.5 text-center">Grade</th>
                   </tr>
                 </thead>
                 <tbody>
                    {templateConfig.coSchooling.map((item) => (
                       <tr key={item.id} className="border-b border-slate-300 relative group/row hover:bg-slate-50">
                         <td className="p-1.5 border-r border-slate-300 relative" style={{ color: templateConfig.theme.headerText }}>
                            <button onClick={() => removeRow('coschooling', item.id)} className="absolute -left-5 top-1 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                            <input type="text" value={item.name} onChange={(e) => updateRow('coschooling', item.id, e.target.value)} className="w-full outline-none bg-transparent"/>
                         </td>
                         <td className="p-1.5 text-center font-mono text-slate-400">{'{{G}}'}</td>
                       </tr>
                    ))}
                 </tbody>
               </table>
            </div>

            {/* Right Table: Discipline */}
            <div className="relative group">
               <button onClick={() => addSubject('discipline')} className="absolute -right-2 -top-6 text-xs text-indigo-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden flex items-center gap-1 font-bold"><Plus size={14}/> Add Discipline</button>
               <table className="w-full border-collapse border border-slate-400 text-[11px] bg-white">
                 <thead>
                   <tr>
                     <th colSpan="2" className="p-1.5 text-center text-white font-bold tracking-wider" style={{ background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)' }}>DISCIPLINE</th>
                   </tr>
                   <tr className="bg-sky-50 border-b border-slate-400" style={{ color: templateConfig.theme.headerText }}>
                     <th className="p-1.5 text-left border-r border-slate-400 w-[75%]">Activity</th>
                     <th className="p-1.5 text-center">Grade</th>
                   </tr>
                 </thead>
                 <tbody>
                    {templateConfig.discipline.map((item) => (
                       <tr key={item.id} className="border-b border-slate-300 relative group/row hover:bg-slate-50">
                         <td className="p-1.5 border-r border-slate-300 relative" style={{ color: templateConfig.theme.headerText }}>
                            <button onClick={() => removeRow('discipline', item.id)} className="absolute -right-5 top-1 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                            <input type="text" value={item.name} onChange={(e) => updateRow('discipline', item.id, e.target.value)} className="w-full outline-none bg-transparent"/>
                         </td>
                         <td className="p-1.5 text-center font-mono text-slate-400">{'{{G}}'}</td>
                       </tr>
                    ))}
                 </tbody>
               </table>
            </div>

          </div>

          {/* ===================== FOOTER & GRADING SCALE ===================== */}
          <div className="mt-auto">
             <div className="mb-4">
                <input type="text" value={templateConfig.footer.promotionText} onChange={(e) => setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, promotionText: e.target.value}})} 
                   className="w-full text-[13px] font-bold outline-none bg-transparent text-slate-800"/>
             </div>

             <div className="flex flex-col items-center mb-8">
                <span contentEditable suppressContentEditableWarning className="text-[10px] text-slate-600 font-bold mb-1">Grading Scale for Scholastic Areas</span>
                <table contentEditable suppressContentEditableWarning className="border-collapse border border-slate-400 text-[10px] text-center w-[80%] bg-white">
                   <thead>
                      <tr className="bg-[#0ea5e9] text-white">
                         <th className="border border-slate-400 p-1">Marks Range</th>
                         <th className="border border-slate-400 p-1 w-12">91-100</th>
                         <th className="border border-slate-400 p-1 w-12">81-90</th>
                         <th className="border border-slate-400 p-1 w-12">71-80</th>
                         <th className="border border-slate-400 p-1 w-12">61-70</th>
                         <th className="border border-slate-400 p-1 w-12">51-60</th>
                         <th className="border border-slate-400 p-1 w-12">41-50</th>
                         <th className="border border-slate-400 p-1 w-12">32-40</th>
                      </tr>
                   </thead>
                   <tbody style={{ color: templateConfig.theme.headerText }} className="font-bold">
                      <tr>
                         <td className="border border-slate-400 p-1 bg-slate-50">Grade</td>
                         <td className="border border-slate-400 p-1">A+</td>
                         <td className="border border-slate-400 p-1">A</td>
                         <td className="border border-slate-400 p-1">B+</td>
                         <td className="border border-slate-400 p-1">B</td>
                         <td className="border border-slate-400 p-1">C+</td>
                         <td className="border border-slate-400 p-1">C</td>
                         <td className="border border-slate-400 p-1">D</td>
                      </tr>
                   </tbody>
                </table>
             </div>

             <div className="flex justify-between px-6 pb-2 text-[13px] font-serif italic" style={{ color: templateConfig.theme.headerText }}>
                <input type="text" value={templateConfig.footer.signatures[0]} onChange={(e) => {
                   const newSigs = [...templateConfig.footer.signatures]; newSigs[0] = e.target.value;
                   setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, signatures: newSigs}});
                }} className="outline-none bg-transparent w-48 text-left border-b border-transparent hover:border-slate-300"/>
                
                <input type="text" value={templateConfig.footer.signatures[1]} onChange={(e) => {
                   const newSigs = [...templateConfig.footer.signatures]; newSigs[1] = e.target.value;
                   setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, signatures: newSigs}});
                }} className="outline-none bg-transparent w-48 text-right border-b border-transparent hover:border-slate-300"/>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
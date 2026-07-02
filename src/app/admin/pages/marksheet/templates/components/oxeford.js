"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, Settings2, PlusCircle } from "lucide-react";

export default function OxefordTemplate() {
  // 🗄️ MASTER JSON CONFIGURATION
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_icse_001",
    templateName: "ICSE / Premium Standard Layout",
    theme: {
      primaryColor: "#0f766e", // Teal/Deep Green
      secondaryColor: "#042f2e", // Darker Green
      tableBg: "#f0fdfa", // Very light teal for headers
    },
    header: {
      schoolName: "OXFORD INTERNATIONAL ACADEMY",
      tagline: "An English Medium Co-Educational Senior Secondary School",
      address: "123, Knowledge Park, Smart City, State - 123456",
      contact: "Phone: +91 9876543210 | Email: info@oxfordacademy.com",
      title: "PROGRESS REPORT",
      session: "Session: 2023 - 2024",
    },
    // DYNAMIC EXAMS (Terms)
    terms: [
      { id: "term_1", name: "Half Yearly Examination" },
      { id: "term_2", name: "Annual Examination" }
    ],
    // DYNAMIC COLUMNS UNDER EACH EXAM
    examColumns: [
      { id: "col_max", label: "Max Marks" },
      { id: "col_min", label: "Min Marks" },
      { id: "col_obt", label: "Marks Obtained" },
      { id: "col_grd", label: "Grade" }
    ],
    // DYNAMIC SUBJECTS (Rows)
    subjects: [
      { id: "sub_1", name: "English Language" },
      { id: "sub_2", name: "English Literature" },
      { id: "sub_3", name: "Hindi / Regional Language" },
      { id: "sub_4", name: "Mathematics" },
      { id: "sub_5", name: "Science (Phy, Chem, Bio)" },
      { id: "sub_6", name: "History & Civics" },
      { id: "sub_7", name: "Geography" },
      { id: "sub_8", name: "Computer Applications" },
    ],
    coCurricular: [
      { id: "co_1", name: "SUPW & Community Service" },
      { id: "co_2", name: "Physical Education" },
      { id: "co_3", name: "Art & Craft" },
    ],
    footer: {
      attendance: "Attendance: ........ / ........ Days",
      remarks: "General Remarks: ................................................................................",
      signatures: ["Class Teacher", "Principal", "Parent / Guardian"]
    }
  });

  // ================= ACTION HANDLERS =================

  const handleTextChange = (section, field, value) => {
    setTemplateConfig({ ...templateConfig, [section]: { ...templateConfig[section], [field]: value } });
  };

  const handleThemeChange = (field, value) => {
    setTemplateConfig({ ...templateConfig, theme: { ...templateConfig.theme, [field]: value } });
  };

  // --- ROWS LOGIC ---
  const addSubject = (type) => {
    const newId = `item_${Date.now()}`;
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, subjects: [...templateConfig.subjects, { id: newId, name: "New Subject" }] });
    } else {
      setTemplateConfig({ ...templateConfig, coCurricular: [...templateConfig.coCurricular, { id: newId, name: "New Activity" }] });
    }
  };

  const updateSubject = (type, id, value) => {
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.map(s => s.id === id ? { ...s, name: value } : s) });
    } else {
      setTemplateConfig({ ...templateConfig, coCurricular: templateConfig.coCurricular.map(s => s.id === id ? { ...s, name: value } : s) });
    }
  };

  const removeSubject = (type, id) => {
    if (type === 'scholastic') {
      setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.filter(s => s.id !== id) });
    } else {
      setTemplateConfig({ ...templateConfig, coCurricular: templateConfig.coCurricular.filter(s => s.id !== id) });
    }
  };

  // --- TERMS LOGIC ---
  const addTerm = () => {
    const newTerm = { id: `term_${Date.now()}`, name: "New Examination" };
    setTemplateConfig({ ...templateConfig, terms: [...templateConfig.terms, newTerm] });
  };

  const removeTerm = (id) => {
    setTemplateConfig({ ...templateConfig, terms: templateConfig.terms.filter(t => t.id !== id) });
  };

  const handleSave = () => {
    console.log("Saving ICSE/Standard Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("✨ Premium Standard Template Saved! Database mapping is ready.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-teal-600"/>
            <span className="font-bold text-lg">Professional Format Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Click text to edit • Hover over rows/cols to add/delete</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <label className="text-xs font-bold text-slate-600">Theme:</label>
             <input type="color" value={templateConfig.theme.primaryColor} onChange={(e) => handleThemeChange('primaryColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0"/>
          </div>
          <button onClick={addTerm} className="flex items-center gap-1.5 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-100 transition-all border border-teal-200">
            <PlusCircle size={16} /> Add Term
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
            <Save size={16} /> Save Layout
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[12mm] relative text-slate-800">
        
        {/* Outer Formal Border */}
        <div className="w-full h-full border-[3px] p-[3px]" style={{ borderColor: templateConfig.theme.primaryColor }}>
          <div className="w-full h-full border border-slate-300 p-6 relative flex flex-col">
            
            {/* HEADER SECTION */}
            <div className="flex justify-between items-center border-b-2 pb-4 mb-4" style={{ borderColor: templateConfig.theme.primaryColor }}>
              
              {/* Logo Area */}
              <div className="w-24 h-24 border border-dashed border-slate-300 rounded-full flex items-center justify-center bg-slate-50 group cursor-pointer hover:bg-slate-100">
                 <ImageIcon size={24} className="text-slate-400 group-hover:hidden" />
                 <span className="hidden group-hover:block text-[10px] font-bold text-slate-500 text-center px-1">Upload Logo</span>
              </div>

              {/* School Info */}
              <div className="flex-1 text-center px-4">
                <input type="text" value={templateConfig.header.schoolName} onChange={(e) => handleTextChange('header', 'schoolName', e.target.value)}
                  className="w-full text-3xl font-serif font-bold uppercase text-center outline-none bg-transparent tracking-wide"
                  style={{ color: templateConfig.theme.primaryColor }} />
                
                <input type="text" value={templateConfig.header.tagline} onChange={(e) => handleTextChange('header', 'tagline', e.target.value)}
                  className="w-full text-xs font-semibold text-center outline-none bg-transparent mt-1 uppercase text-slate-600 tracking-widest"/>
                
                <input type="text" value={templateConfig.header.address} onChange={(e) => handleTextChange('header', 'address', e.target.value)}
                  className="w-full text-xs text-center outline-none bg-transparent mt-1 text-slate-700"/>
                
                <input type="text" value={templateConfig.header.contact} onChange={(e) => handleTextChange('header', 'contact', e.target.value)}
                  className="w-full text-xs text-center outline-none bg-transparent mt-0.5 text-slate-700"/>
              </div>

              {/* Photo Area */}
              <div className="w-20 h-28 border border-slate-300 flex flex-col items-center justify-center bg-slate-50 p-1">
                 <div className="flex-1 w-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 text-center">
                    Student Photo
                 </div>
              </div>
            </div>

            {/* TITLE & SESSION */}
            <div className="text-center mb-6">
               <input type="text" value={templateConfig.header.title} onChange={(e) => handleTextChange('header', 'title', e.target.value)}
                  className="text-xl font-bold text-center outline-none px-6 py-1 border-2 uppercase tracking-widest rounded-md"
                  style={{ color: templateConfig.theme.primaryColor, borderColor: templateConfig.theme.primaryColor }}/>
               <br/>
               <input type="text" value={templateConfig.header.session} onChange={(e) => handleTextChange('header', 'session', e.target.value)}
                  className="w-48 text-sm font-semibold text-center outline-none bg-transparent mt-3 text-slate-700"/>
            </div>

            {/* STUDENT DETAILS GRID */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-[13px] font-medium text-slate-700">
               <div className="flex"><span className="w-36">Admission No.</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.admissionNo}}'}</span></div>
               <div className="flex"><span className="w-36">Roll No.</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.rollNo}}'}</span></div>
               <div className="flex"><span className="w-36">Student's Name</span> <span className="flex-1 font-bold text-slate-900 uppercase border-b border-dotted border-slate-400">{'{{student.name}}'}</span></div>
               <div className="flex"><span className="w-36">Class & Section</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.class}}'}</span></div>
               <div className="flex"><span className="w-36">Mother's Name</span> <span className="flex-1 font-bold text-slate-900 uppercase border-b border-dotted border-slate-400">{'{{student.motherName}}'}</span></div>
               <div className="flex"><span className="w-36">Date of Birth</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.dob}}'}</span></div>
               <div className="flex"><span className="w-36">Father's Name</span> <span className="flex-1 font-bold text-slate-900 uppercase border-b border-dotted border-slate-400">{'{{student.fatherName}}'}</span></div>
            </div>

            {/* ===================== ACADEMIC PERFORMANCE TABLE ===================== */}
            <div className="mb-6 relative group flex-1">
              <button onClick={() => addSubject('scholastic')} className="absolute -left-6 top-10 text-teal-600  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden transition-all z-10" title="Add Subject"><PlusCircle size={20}/></button>

              <table className="w-full border-collapse border border-slate-400 text-[11px] text-center bg-white">
                <thead>
                  {/* Exam Headers */}
                  <tr style={{ backgroundColor: templateConfig.theme.tableBg, color: templateConfig.theme.secondaryColor }}>
                    <th className="border border-slate-400 p-2 text-left uppercase tracking-wider w-[25%]" rowSpan="2">
                       Scholastic Area
                    </th>
                    {templateConfig.terms.map(term => (
                       <th key={term.id} colSpan="4" className="border border-slate-400 p-1.5 uppercase font-bold relative group/term">
                          <input type="text" value={term.name} onChange={(e) => {
                             const newTerms = templateConfig.terms.map(t => t.id === term.id ? {...t, name: e.target.value} : t);
                             setTemplateConfig({...templateConfig, terms: newTerms});
                          }} className="w-full text-center outline-none bg-transparent"/>
                          <button onClick={() => removeTerm(term.id)} className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={12}/></button>
                       </th>
                    ))}
                  </tr>
                  
                  {/* Sub-Columns (Max/Min/Obt/Grade) */}
                  <tr style={{ backgroundColor: templateConfig.theme.tableBg, color: templateConfig.theme.secondaryColor }}>
                    {templateConfig.terms.map(term => (
                       templateConfig.examColumns.map((col, idx) => (
                          <th key={`${term.id}_${idx}`} className="border border-slate-400 p-1.5 font-semibold text-[10px] w-[8%]">
                             {col.label}
                          </th>
                       ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {templateConfig.subjects.map((sub) => (
                    <tr key={sub.id} className="group/row hover:bg-slate-50">
                      <td className="border border-slate-400 p-2 text-left relative font-semibold text-slate-800">
                        <button onClick={() => removeSubject('scholastic', sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-1 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={12}/></button>
                        <input type="text" value={sub.name} onChange={(e) => updateSubject('scholastic', sub.id, e.target.value)} className="w-full outline-none bg-transparent"/>
                      </td>
                      
                      {/* Loop through terms & columns */}
                      {templateConfig.terms.map(term => (
                         templateConfig.examColumns.map((col, idx) => (
                            <td key={`${sub.id}_${term.id}_${idx}`} className={`border border-slate-400 p-2 font-mono text-slate-600 ${idx === 2 ? 'font-bold text-slate-900 bg-slate-50/50' : ''}`}>
                               {idx === 0 ? '100' : idx === 1 ? '33' : idx === 2 ? '{{db}}' : '{{G}}'}
                            </td>
                         ))
                      ))}
                    </tr>
                  ))}
                  
                  {/* Grand Total Row */}
                  <tr className="bg-slate-50" style={{ color: templateConfig.theme.primaryColor }}>
                     <td className="border border-slate-400 p-2 text-right font-bold uppercase tracking-widest">Grand Total</td>
                     {templateConfig.terms.map(term => (
                        <React.Fragment key={`total_${term.id}`}>
                           <td className="border border-slate-400 p-2 font-bold font-mono">{'{{Tot}}'}</td>
                           <td className="border border-slate-400 p-2 font-bold font-mono text-slate-400">--</td>
                           <td className="border border-slate-400 p-2 font-bold font-mono text-slate-900 bg-slate-100">{'{{Sum}}'}</td>
                           <td className="border border-slate-400 p-2 font-bold font-mono">{'{{%}}'}</td>
                        </React.Fragment>
                     ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ===================== CO-CURRICULAR & ATTENDANCE ===================== */}
            <div className="grid grid-cols-12 gap-6 mb-6">
               <div className="col-span-7 relative group">
                  <button onClick={() => addSubject('cocurricular')} className="absolute -left-6 top-6 text-teal-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><PlusCircle size={16}/></button>
                  <table className="w-full border-collapse border border-slate-400 text-[11px] text-left bg-white">
                     <thead>
                        <tr style={{ backgroundColor: templateConfig.theme.tableBg, color: templateConfig.theme.secondaryColor }}>
                           <th className="border border-slate-400 p-1.5 uppercase w-[70%]">Co-Curricular Activities</th>
                           <th className="border border-slate-400 p-1.5 uppercase text-center">Grade</th>
                        </tr>
                     </thead>
                     <tbody>
                        {templateConfig.coCurricular.map((item) => (
                           <tr key={item.id} className="group/row hover:bg-slate-50">
                              <td className="border border-slate-400 p-1.5 relative">
                                 <button onClick={() => removeSubject('cocurricular', item.id)} className="absolute -left-6 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                                 <input type="text" value={item.name} onChange={(e) => updateSubject('cocurricular', item.id, e.target.value)} className="w-full outline-none bg-transparent font-medium text-slate-800"/>
                              </td>
                              <td className="border border-slate-400 p-1.5 text-center font-mono font-bold text-slate-600">{'{{G}}'}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               <div className="col-span-5 flex flex-col justify-end gap-3 pb-2">
                  <div className="border border-slate-400 p-2 bg-slate-50 text-[11px] font-bold text-slate-700">
                     <span style={{ color: templateConfig.theme.primaryColor }}>RESULT:</span> <span className="font-mono text-slate-900 border-b border-dotted border-slate-400 inline-block w-40 pl-2 uppercase">{'{{Pass/Fail/Promoted}}'}</span>
                  </div>
                  <div className="border border-slate-400 p-2 bg-slate-50 text-[11px] font-bold text-slate-700">
                     <input type="text" value={templateConfig.footer.attendance} onChange={(e) => handleTextChange('footer', 'attendance', e.target.value)} className="w-full outline-none bg-transparent"/>
                  </div>
               </div>
            </div>

            {/* ===================== FOOTER / REMARKS / SIGNATURES ===================== */}
            <div className="mt-auto">
               <div className="mb-12 text-sm font-semibold text-slate-800">
                  <input type="text" value={templateConfig.footer.remarks} onChange={(e) => handleTextChange('footer', 'remarks', e.target.value)} className="w-full outline-none bg-transparent italic"/>
               </div>

               <div className="flex justify-between items-end px-4 font-bold text-[13px]" style={{ color: templateConfig.theme.secondaryColor }}>
                  {templateConfig.footer.signatures.map((sig, idx) => (
                     <div key={idx} className="w-40 text-center border-t border-slate-400 pt-2">
                        <input type="text" value={sig} onChange={(e) => {
                           const newSigs = [...templateConfig.footer.signatures]; newSigs[idx] = e.target.value;
                           setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, signatures: newSigs}});
                        }} className="w-full text-center outline-none bg-transparent uppercase tracking-wider"/>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
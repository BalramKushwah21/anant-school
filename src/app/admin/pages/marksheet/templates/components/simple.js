"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, Settings2, PlusCircle, ShieldCheck } from "lucide-react";

export default function KVTemplate() {
  // 🗄️ MASTER JSON CONFIGURATION
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_icse_002_pro",
    templateName: "Elite Academic Format",
    theme: {
      primaryColor: "#431407", // Deep Rich Brown/Maroon for a very elite, classic look
      secondaryColor: "#78350f", // Lighter Brown
      tableBg: "#fffbeb", // Very light warm background
    },
    settings: {
      showMinMarks: true,
      showWatermark: true,
    },
    header: {
      schoolName: "THE HERITAGE INTERNATIONAL SCHOOL",
      tagline: "AFFILIATED TO THE COUNCIL FOR THE INDIAN SCHOOL CERTIFICATE EXAMINATIONS, NEW DELHI",
      address: "Campus 2, Elite Valley, Cyber City - 400001",
      contact: "Ph: +91 9876543210 | Web: www.heritage-elite.edu",
      title: "STATEMENT OF MARKS & GRADES",
      session: "Academic Year: 2024 - 2025",
    },
    terms: [
      { id: "term_1", name: "Half Yearly Exam" },
      { id: "term_2", name: "Final Examination" }
    ],
    subjects: [
      { id: "sub_1", name: "English Language (Paper I)" },
      { id: "sub_2", name: "English Literature (Paper II)" },
      { id: "sub_3", name: "Second Language (Hindi)" },
      { id: "sub_4", name: "Mathematics" },
      { id: "sub_5", name: "Science (Phy, Chem, Bio)" },
      { id: "sub_6", name: "History, Civics & Geography" },
      { id: "sub_7", name: "Computer Applications" },
    ],
    coCurricular: [
      { id: "co_1", name: "Physical Education" },
      { id: "co_2", name: "Social & Community Service" },
      { id: "co_3", name: "Art, Craft & Music" },
    ],
    footer: {
      attendance: "Attendance: ........ / ........ Days",
      remarks: "Class Teacher's Remarks: .................................................................................................................................",
      signatures: ["Class Teacher", "Coordinator", "Principal"]
    }
  });

  // ================= ACTION HANDLERS =================

  const handleTextChange = (section, field, value) => {
    setTemplateConfig({ ...templateConfig, [section]: { ...templateConfig[section], [field]: value } });
  };

  const handleThemeChange = (field, value) => {
    setTemplateConfig({ ...templateConfig, theme: { ...templateConfig.theme, [field]: value } });
  };

  const toggleSetting = (field) => {
    setTemplateConfig({ ...templateConfig, settings: { ...templateConfig.settings, [field]: !templateConfig.settings[field] } });
  };

  // Row & Column Handlers
  const addSubject = (type) => {
    const newId = `item_${Date.now()}`;
    if (type === 'scholastic') setTemplateConfig({ ...templateConfig, subjects: [...templateConfig.subjects, { id: newId, name: "New Subject" }] });
    else setTemplateConfig({ ...templateConfig, coCurricular: [...templateConfig.coCurricular, { id: newId, name: "New Activity" }] });
  };

  const updateSubject = (type, id, value) => {
    if (type === 'scholastic') setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.map(s => s.id === id ? { ...s, name: value } : s) });
    else setTemplateConfig({ ...templateConfig, coCurricular: templateConfig.coCurricular.map(s => s.id === id ? { ...s, name: value } : s) });
  };

  const removeRow = (type, id) => {
    if (type === 'scholastic') setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.filter(s => s.id !== id) });
    else setTemplateConfig({ ...templateConfig, coCurricular: templateConfig.coCurricular.filter(s => s.id !== id) });
  };

  const addTerm = () => setTemplateConfig({ ...templateConfig, terms: [...templateConfig.terms, { id: `term_${Date.now()}`, name: "New Exam" }] });
  const removeTerm = (id) => setTemplateConfig({ ...templateConfig, terms: templateConfig.terms.filter(t => t.id !== id) });

  const handleSave = () => {
    console.log("Saving Enhanced Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("✨ Elite Template Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-amber-700"/>
            <span className="font-bold text-lg">Elite Format Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Configure your premium marksheet layout</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">
             <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={templateConfig.settings.showMinMarks} onChange={() => toggleSetting('showMinMarks')} className="w-3.5 h-3.5 accent-amber-700"/>
                Show Min Marks
             </label>
             <div className="w-px h-4 bg-slate-300"></div>
             <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={templateConfig.settings.showWatermark} onChange={() => toggleSetting('showWatermark')} className="w-3.5 h-3.5 accent-amber-700"/>
                Watermark
             </label>
             <div className="w-px h-4 bg-slate-300"></div>
             <input type="color" value={templateConfig.theme.primaryColor} onChange={(e) => handleThemeChange('primaryColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none p-0" title="Theme Color"/>
          </div>
          
          <button onClick={addTerm} className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-2 rounded-lg text-sm font-bold hover:bg-amber-100 border border-amber-200 transition-colors">
            <PlusCircle size={14} /> Add Term
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 shadow-md">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[12mm] relative text-slate-800 flex flex-col">
        
        {/* OPTIONAL WATERMARK */}
        {templateConfig.settings.showWatermark && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
              <ShieldCheck size={500} style={{ color: templateConfig.theme.primaryColor }} />
           </div>
        )}

        <div className="w-full h-full border-[1.5px] p-[4px] z-10 bg-transparent" style={{ borderColor: templateConfig.theme.primaryColor }}>
          <div className="w-full h-full border-[3px] border-double p-6 relative flex flex-col" style={{ borderColor: templateConfig.theme.primaryColor }}>
            
            {/* HEADER SECTION */}
            <div className="flex justify-between items-center border-b-2 pb-5 mb-5" style={{ borderColor: templateConfig.theme.primaryColor }}>
              
              {/* Logo Area */}
              <div className="w-24 h-28 border-2 border-dashed border-slate-300 rounded-b-full flex items-center justify-center bg-slate-50 group cursor-pointer hover:bg-slate-100">
                 <ImageIcon size={24} className="text-slate-400 group-hover:hidden" />
                 <span className="hidden group-hover:block text-[10px] font-bold text-slate-500 text-center px-1">Upload Shield</span>
              </div>

              {/* School Info */}
              <div className="flex-1 text-center px-4">
                <input type="text" value={templateConfig.header.schoolName} onChange={(e) => handleTextChange('header', 'schoolName', e.target.value)}
                  className="w-full text-3xl font-serif font-black uppercase text-center outline-none bg-transparent tracking-wide"
                  style={{ color: templateConfig.theme.primaryColor }} />
                
                <input type="text" value={templateConfig.header.tagline} onChange={(e) => handleTextChange('header', 'tagline', e.target.value)}
                  className="w-full text-[10px] font-bold text-center outline-none bg-transparent mt-1.5 uppercase text-slate-500 tracking-widest"/>
                
                <input type="text" value={templateConfig.header.address} onChange={(e) => handleTextChange('header', 'address', e.target.value)}
                  className="w-full text-xs text-center outline-none bg-transparent mt-1.5 text-slate-700 font-medium"/>
                
                <input type="text" value={templateConfig.header.contact} onChange={(e) => handleTextChange('header', 'contact', e.target.value)}
                  className="w-full text-[11px] text-center outline-none bg-transparent mt-0.5 text-slate-600 italic"/>
              </div>

              {/* Passport Photo */}
              <div className="w-20 h-28 border-[1.5px] border-slate-400 flex flex-col items-center justify-center bg-slate-50 p-1 shadow-inner">
                 <div className="flex-1 w-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 text-center">
                    Student<br/>Photo
                 </div>
              </div>
            </div>

            {/* TITLE & SESSION */}
            <div className="text-center mb-6">
               <input type="text" value={templateConfig.header.title} onChange={(e) => handleTextChange('header', 'title', e.target.value)}
                  className="text-xl font-bold text-center outline-none px-8 py-1.5 border-[1.5px] uppercase tracking-widest bg-white"
                  style={{ color: templateConfig.theme.primaryColor, borderColor: templateConfig.theme.primaryColor }}/>
               <br/>
               <input type="text" value={templateConfig.header.session} onChange={(e) => handleTextChange('header', 'session', e.target.value)}
                  className="w-64 text-sm font-bold text-center outline-none bg-transparent mt-4 text-slate-800 border-b border-slate-300 pb-1"/>
            </div>

            {/* STUDENT DETAILS GRID */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 text-[13px] font-medium text-slate-700 px-2">
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Admission No.</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.admissionNo}}'}</span></div>
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Roll No.</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.rollNo}}'}</span></div>
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Student's Name</span> <span className="flex-1 font-black text-slate-900 uppercase border-b border-dotted border-slate-400">{'{{student.name}}'}</span></div>
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Class & Section</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.class}}'}</span></div>
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Mother's Name</span> <span className="flex-1 font-bold text-slate-900 uppercase border-b border-dotted border-slate-400">{'{{student.motherName}}'}</span></div>
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Date of Birth</span> <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400">{'{{student.dob}}'}</span></div>
               <div className="flex"><span className="w-36 uppercase text-xs font-bold" style={{color: templateConfig.theme.secondaryColor}}>Father's Name</span> <span className="flex-1 font-bold text-slate-900 uppercase border-b border-dotted border-slate-400">{'{{student.fatherName}}'}</span></div>
            </div>

            {/* ===================== ACADEMIC PERFORMANCE TABLE ===================== */}
            <div className="mb-6 relative group flex-1">
              <button onClick={() => addSubject('scholastic')} className="absolute -left-6 top-10 text-amber-700 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden transition-all z-20" title="Add Subject"><PlusCircle size={20}/></button>

              <table className="w-full border-collapse border border-slate-400 text-[11px] text-center bg-white/80 backdrop-blur-sm">
                <thead>
                  <tr style={{ backgroundColor: templateConfig.theme.tableBg, color: templateConfig.theme.primaryColor }}>
                    <th className="border border-slate-400 p-2 text-left uppercase tracking-wider w-[28%]" rowSpan="2">
                       Part I: Scholastic Area
                    </th>
                    {templateConfig.terms.map(term => (
                       <th key={term.id} colSpan={templateConfig.settings.showMinMarks ? 4 : 3} className="border border-slate-400 p-1.5 uppercase font-bold relative group/term">
                          <input type="text" value={term.name} onChange={(e) => {
                             const newTerms = templateConfig.terms.map(t => t.id === term.id ? {...t, name: e.target.value} : t);
                             setTemplateConfig({...templateConfig, terms: newTerms});
                          }} className="w-full text-center outline-none bg-transparent"/>
                          <button onClick={() => removeTerm(term.id)} className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={12}/></button>
                       </th>
                    ))}
                  </tr>
                  
                  <tr style={{ backgroundColor: templateConfig.theme.tableBg, color: templateConfig.theme.secondaryColor }}>
                    {templateConfig.terms.map(term => (
                       <React.Fragment key={`subcol_${term.id}`}>
                          <th className="border border-slate-400 p-1 font-semibold text-[10px]">Max Marks</th>
                          {templateConfig.settings.showMinMarks && <th className="border border-slate-400 p-1 font-semibold text-[10px]">Min Marks</th>}
                          <th className="border border-slate-400 p-1 font-semibold text-[10px]">Obtained</th>
                          <th className="border border-slate-400 p-1 font-semibold text-[10px]">Grade</th>
                       </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {templateConfig.subjects.map((sub) => (
                    <tr key={sub.id} className="group/row hover:bg-slate-50">
                      <td className="border border-slate-400 p-1.5 text-left relative font-bold text-slate-800 pl-3">
                        <button onClick={() => removeRow('scholastic', sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-1 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={12}/></button>
                        <input type="text" value={sub.name} onChange={(e) => updateSubject('scholastic', sub.id, e.target.value)} className="w-full outline-none bg-transparent"/>
                      </td>
                      
                      {templateConfig.terms.map(term => (
                         <React.Fragment key={`data_${sub.id}_${term.id}`}>
                            <td className="border border-slate-400 p-1.5 font-mono text-slate-500">100</td>
                            {templateConfig.settings.showMinMarks && <td className="border border-slate-400 p-1.5 font-mono text-slate-500">33</td>}
                            <td className="border border-slate-400 p-1.5 font-mono font-bold text-slate-900 bg-slate-50/50">{'{{db}}'}</td>
                            <td className="border border-slate-400 p-1.5 font-mono text-slate-800">{'{{G}}'}</td>
                         </React.Fragment>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Grand Total Row */}
                  <tr className="bg-slate-50" style={{ color: templateConfig.theme.primaryColor }}>
                     <td className="border border-slate-400 p-2 text-right font-black uppercase tracking-widest text-[10px]">Grand Total & %</td>
                     {templateConfig.terms.map(term => (
                        <React.Fragment key={`total_${term.id}`}>
                           <td className="border border-slate-400 p-1.5 font-bold font-mono text-[10px]">{'{{Tot}}'}</td>
                           {templateConfig.settings.showMinMarks && <td className="border border-slate-400 p-1.5 font-bold font-mono text-[10px] text-slate-400">--</td>}
                           <td className="border border-slate-400 p-1.5 font-bold font-mono text-[11px] text-slate-900 bg-slate-100">{'{{Sum}}'}</td>
                           <td className="border border-slate-400 p-1.5 font-bold font-mono text-[11px]">{'{{%}}'}</td>
                        </React.Fragment>
                     ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ===================== CO-CURRICULAR & GRADING ===================== */}
            <div className="grid grid-cols-12 gap-6 mb-4">
               
               {/* Left: Co-Curricular */}
               <div className="col-span-7 relative group">
                  <button onClick={() => addSubject('cocurricular')} className="absolute -left-6 top-6 text-amber-700 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><PlusCircle size={16}/></button>
                  <table className="w-full border-collapse border border-slate-400 text-[11px] text-left bg-white/80">
                     <thead>
                        <tr style={{ backgroundColor: templateConfig.theme.tableBg, color: templateConfig.theme.secondaryColor }}>
                           <th className="border border-slate-400 p-1.5 uppercase w-[75%]">Part II: Co-Curricular Activities</th>
                           <th className="border border-slate-400 p-1.5 uppercase text-center">Grade</th>
                        </tr>
                     </thead>
                     <tbody>
                        {templateConfig.coCurricular.map((item) => (
                           <tr key={item.id} className="group/row hover:bg-slate-50">
                              <td className="border border-slate-400 p-1.5 relative">
                                 <button onClick={() => removeRow('cocurricular', item.id)} className="absolute -left-6 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                                 <input type="text" value={item.name} onChange={(e) => updateSubject('cocurricular', item.id, e.target.value)} className="w-full outline-none bg-transparent font-medium text-slate-800"/>
                              </td>
                              <td className="border border-slate-400 p-1.5 text-center font-mono font-bold text-slate-600">{'{{G}}'}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               {/* Right: Grading Scale Reference */}
               <div className="col-span-5 flex flex-col justify-between pt-1">
                  <div className="border border-slate-400 p-2 bg-slate-50 text-[11px] font-bold text-slate-700 flex justify-between items-center shadow-sm">
                     <span style={{ color: templateConfig.theme.primaryColor }}>FINAL RESULT:</span> 
                     <span className="font-mono text-slate-900 uppercase font-black tracking-wider text-sm">{'{{PROMOTED}}'}</span>
                  </div>
                  
                  {/* Grading Key */}
                  <div contentEditable suppressContentEditableWarning className="mt-2">
                     <div className="text-[9px] font-bold uppercase mb-1" style={{color: templateConfig.theme.secondaryColor}}>Grading Key</div>
                     <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-semibold text-slate-600">
                        <div className="border border-slate-300 bg-slate-50 p-0.5">A+ (90-100)</div>
                        <div className="border border-slate-300 bg-slate-50 p-0.5">A (80-89)</div>
                        <div className="border border-slate-300 bg-slate-50 p-0.5">B+ (70-79)</div>
                        <div className="border border-slate-300 bg-slate-50 p-0.5">B (60-69)</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* ===================== FOOTER / REMARKS / SIGNATURES ===================== */}
            <div className="mt-auto">
               <div className="mb-2 text-[12px] font-bold text-slate-800">
                  <input type="text" value={templateConfig.footer.attendance} onChange={(e) => handleTextChange('footer', 'attendance', e.target.value)} className="w-full outline-none bg-transparent"/>
               </div>
               <div className="mb-10 text-[12px] font-bold text-slate-800">
                  <input type="text" value={templateConfig.footer.remarks} onChange={(e) => handleTextChange('footer', 'remarks', e.target.value)} className="w-full outline-none bg-transparent"/>
               </div>

               <div className="flex justify-between items-end px-4 font-bold text-[13px] uppercase tracking-wide" style={{ color: templateConfig.theme.primaryColor }}>
                  {templateConfig.footer.signatures.map((sig, idx) => (
                     <div key={idx} className="w-40 text-center border-t border-slate-400 pt-2 border-dotted">
                        <input type="text" value={sig} onChange={(e) => {
                           const newSigs = [...templateConfig.footer.signatures]; newSigs[idx] = e.target.value;
                           setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, signatures: newSigs}});
                        }} className="w-full text-center outline-none bg-transparent"/>
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
"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, Settings2, ShieldCheck } from "lucide-react";

export default function ModernTemplate() {
  // 🗄️ MASTER JSON CONFIGURATION
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_convent_001",
    templateName: "Primary Convent Format",
    theme: {
      schoolNameColor: "#b91c1c", // Red
      tableHeaderBg: "#1e3a8a",   // Navy Blue
      redLabels: "#dc2626",       // Accent Red
    },
    header: {
      schoolName: "BRS SCIENCE CONVENT SCHOOL",
      address: "AINWA CHAUKI, TANDA, DISTT.-AMBEDKAR NAGAR",
      contact: "Contact No. 8415460167, 9918011552, 9038813900",
      sessionLabel: "ACADEMIC SESSION :",
      sessionValue: "2023-24",
      title: "REPORT CARD",
    },
    // DYNAMIC SUBJECTS (Rows)
    subjects: [
      { id: "sub_1", name: "ENGLISH" },
      { id: "sub_2", name: "HINDI" },
      { id: "sub_3", name: "MATHEMATICS" },
      { id: "sub_4", name: "EVS" },
      { id: "sub_5", name: "SOCIAL SCIENCE" },
      { id: "sub_6", name: "COMPUTER" },
    ],
    footer: {
      resultLabel: "RESULT",
      resultValue: "PROMOTED TO STD",
      dateLabel: "Date.....................",
      teacherLabel: "(Class Teacher)",
      principalLabel: "Principal",
    }
  });

  // ================= ACTION HANDLERS =================

  const handleTextChange = (section, field, value) => {
    setTemplateConfig({ ...templateConfig, [section]: { ...templateConfig[section], [field]: value } });
  };

  const handleThemeChange = (field, value) => {
    setTemplateConfig({ ...templateConfig, theme: { ...templateConfig.theme, [field]: value } });
  };

  // --- SUBJECTS (Rows) LOGIC ---
  const addSubject = () => {
    const newSub = { id: `sub_${Date.now()}`, name: "NEW SUBJECT" };
    setTemplateConfig({ ...templateConfig, subjects: [...templateConfig.subjects, newSub] });
  };

  const updateSubject = (id, value) => {
    setTemplateConfig({
      ...templateConfig,
      subjects: templateConfig.subjects.map(s => s.id === id ? { ...s, name: value } : s)
    });
  };

  const removeSubject = (id) => {
    setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.filter(s => s.id !== id) });
  };

  const handleSave = () => {
    console.log("Saving Convent Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("✨ Convent Template Saved! Ready to be mapped with database backend.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-indigo-600"/>
            <span className="font-bold text-lg">Convent Format Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Click text to edit • Hover over rows to Add/Delete</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <label className="text-xs font-bold text-slate-600">Theme:</label>
             <input type="color" value={templateConfig.theme.schoolNameColor} onChange={(e) => handleThemeChange('schoolNameColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none p-0" title="School Name Color"/>
             <input type="color" value={templateConfig.theme.tableHeaderBg} onChange={(e) => handleThemeChange('tableHeaderBg', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none p-0" title="Table Header Color"/>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl relative overflow-hidden flex flex-col print:shadow-none">
        
        {/* Placeholder for the Grass/Scenic Background (Like the image) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-gradient-to-b from-green-100 via-white to-green-200 print:hidden"></div>
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.03]">
           <ShieldCheck size={400} />
        </div>

        <div className="z-10 w-full h-full p-[10mm] flex flex-col">
            
          {/* HEADER SECTION */}
          <div className="text-center relative mb-4">
             {/* Decorative Top Area (Kids Placeholder) */}
             <div className="w-full h-16 mb-2 flex justify-between items-center px-8 opacity-40">
                <span className="text-2xl">👧👦📚</span>
                <span className="text-2xl">🌲🎒🏃‍♂️</span>
             </div>

             {/* Central Logo */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-24 border-2 border-dashed border-slate-300 flex items-center justify-center bg-white group cursor-pointer hover:bg-slate-50 transition-all z-20 rounded-b-full shadow-sm">
               <ImageIcon size={20} className="text-slate-400 group-hover:hidden" />
               <span className="hidden group-hover:block text-[9px] font-bold text-slate-500 text-center px-1">Upload Shield Logo</span>
             </div>

             <div className="pt-8">
               <input type="text" value={templateConfig.header.schoolName} onChange={(e) => handleTextChange('header', 'schoolName', e.target.value)}
                  className="w-full text-4xl font-black uppercase text-center outline-none bg-transparent hover:bg-white/50 rounded tracking-wider shadow-sm"
                  style={{ color: templateConfig.theme.schoolNameColor, textShadow: "1px 1px 0px rgba(0,0,0,0.1)" }} />
               
               <input type="text" value={templateConfig.header.address} onChange={(e) => handleTextChange('header', 'address', e.target.value)}
                  className="w-full text-[13px] font-bold text-center outline-none bg-transparent hover:bg-white/50 mt-1 text-slate-800"/>
               
               <input type="text" value={templateConfig.header.contact} onChange={(e) => handleTextChange('header', 'contact', e.target.value)}
                  className="w-full text-[12px] font-bold text-center outline-none bg-transparent hover:bg-white/50 text-red-600 italic tracking-wide"/>
               
               <div className="flex items-center justify-center gap-2 mt-2 font-bold text-slate-800 text-[15px] uppercase">
                  <input type="text" value={templateConfig.header.sessionLabel} onChange={(e) => handleTextChange('header', 'sessionLabel', e.target.value)} className="w-48 text-right outline-none bg-transparent" />
                  <input type="text" value={templateConfig.header.sessionValue} onChange={(e) => handleTextChange('header', 'sessionValue', e.target.value)} className="w-24 text-left outline-none bg-transparent border-b-2 border-slate-800" />
               </div>

               <div className="flex justify-center mt-3">
                  <input type="text" value={templateConfig.header.title} onChange={(e) => handleTextChange('header', 'title', e.target.value)}
                     className="text-lg font-black text-center outline-none px-6 py-1 rounded-full text-white tracking-widest shadow-md"
                     style={{ backgroundColor: templateConfig.theme.schoolNameColor }}/>
               </div>
             </div>
          </div>

          {/* STUDENT INFO BOX */}
          <div className="border-[1.5px] border-slate-800 p-3 text-sm font-bold text-slate-800 mb-4 bg-white/80 backdrop-blur-sm shadow-sm rounded-sm">
             <div className="grid grid-cols-12 gap-y-2">
                <div className="col-span-8 flex"><span className="w-36">Roll No.</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2">{'{{student.rollNo}}'}</span></div>
                <div className="col-span-4 flex"><span className="w-16 text-center">Class</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2">{'{{student.class}}'}</span></div>
                
                <div className="col-span-8 flex"><span className="w-36">Name of Student</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2 uppercase">{'{{student.name}}'}</span></div>
                <div className="col-span-4 flex"><span className="w-28 text-center">Admission No</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2">{'{{student.admissionNo}}'}</span></div>

                <div className="col-span-12 flex"><span className="w-36">Mother's Name</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2 uppercase">{'{{student.motherName}}'}</span></div>
                <div className="col-span-12 flex"><span className="w-36">Father's Name</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2 uppercase">{'{{student.fatherName}}'}</span></div>
                <div className="col-span-12 flex"><span className="w-36">Date of Birth</span> <span className="flex-1 border-b border-slate-400 font-mono text-slate-600 px-2">{'{{student.dob}}'}</span></div>
             </div>
          </div>

          {/* ===================== MARKS TABLE ===================== */}
          <div className="relative group flex-1 bg-white/90 backdrop-blur-md shadow-sm">
            <button onClick={addSubject} className="absolute -left-8 top-10 bg-indigo-600 text-white p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden transition-all shadow-md z-10" title="Add Subject Row"><Plus size={16}/></button>
            
            <table contentEditable suppressContentEditableWarning className="w-full border-collapse border-2 border-slate-800 text-[11px] text-center font-bold">
              <thead>
                {/* Header Row 1 (Navy Blue) */}
                <tr style={{ backgroundColor: templateConfig.theme.tableHeaderBg }} className="text-white text-xs">
                  <th className="border border-slate-800 p-2 w-[22%]"></th>
                  <th colSpan="3" className="border border-slate-800 p-1.5 uppercase tracking-widest">TERM- I</th>
                  <th colSpan="3" className="border border-slate-800 p-1.5 uppercase tracking-widest">TERM- II</th>
                  <th colSpan="2" className="border border-slate-800 p-1.5 uppercase tracking-widest">GRAND TOTAL</th>
                </tr>
                
                {/* Header Row 2 */}
                <tr className="bg-slate-50 text-[10px]">
                  <th className="border border-slate-800 p-2" style={{ color: templateConfig.theme.redLabels }}>SUBJECT</th>
                  
                  <th className="border border-slate-800 p-1 text-slate-800">PA<br/>(20)</th>
                  <th className="border border-slate-800 p-1 text-slate-800">HALF<br/>YEARLY<br/>(30)</th>
                  <th className="border border-slate-800 p-1 text-slate-800">HY<br/>TOTAL<br/>(100)</th>
                  
                  <th className="border border-slate-800 p-1 text-slate-800">PA.<br/>(20)</th>
                  <th className="border border-slate-800 p-1 text-slate-800">YEARLY<br/>(80)</th>
                  <th className="border border-slate-800 p-1 text-slate-800">YEARLY<br/>TOTAL<br/>(100)</th>
                  
                  <th className="border border-slate-800 p-1 text-slate-800">TOTAL<br/>(200)</th>
                  <th className="border border-slate-800 p-1 text-slate-800">GRADE</th>
                </tr>
              </thead>
              
              <tbody>
                {/* Dynamic Subject Rows */}
                {templateConfig.subjects.map((sub) => (
                  <tr key={sub.id} className="group/row hover:bg-slate-100">
                    <td className="border border-slate-800 p-1.5 relative text-left pl-3 bg-slate-50/50">
                      <button onClick={() => removeSubject(sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-1 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                      <input type="text" value={sub.name} onChange={(e) => updateSubject(sub.id, e.target.value)} className="w-full outline-none uppercase bg-transparent font-black text-slate-800"/>
                    </td>
                    
                    {/* Database Placeholders */}
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-500 font-medium">{'{{db}}'}</td>
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-500 font-medium">{'{{db}}'}</td>
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-500 font-medium">{'{{tot}}'}</td>
                    
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-500 font-medium">{'{{db}}'}</td>
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-500 font-medium">{'{{db}}'}</td>
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-500 font-medium">{'{{tot}}'}</td>
                    
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-800 font-bold bg-slate-50/30">{'{{G.Tot}}'}</td>
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-800 font-bold">{'{{Grd}}'}</td>
                  </tr>
                ))}

                {/* Footer Rows (Grand Total & Percentage) */}
                <tr className="bg-slate-50/80">
                   <td colSpan="7" className="border border-slate-800 p-2.5 text-right font-black tracking-widest uppercase" style={{ color: templateConfig.theme.redLabels }}>
                      GRAND TOTAL
                   </td>
                   <td colSpan="2" className="border border-slate-800 p-2.5 font-mono text-slate-800 text-center">{'{{auto_sum}}'}</td>
                </tr>
                <tr className="bg-slate-50/80">
                   <td colSpan="7" className="border border-slate-800 p-2.5 text-right font-black tracking-widest uppercase" style={{ color: templateConfig.theme.redLabels }}>
                      PERCENTAGE
                   </td>
                   <td colSpan="2" className="border border-slate-800 p-2.5 font-mono text-slate-800 text-center">{'{{auto_%}}'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ===================== FOOTER SECTION ===================== */}
          <div className="mt-6 font-bold text-sm bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
             <div className="flex justify-between items-center mb-12 px-2">
                <div className="flex items-center gap-2">
                   <input type="text" value={templateConfig.footer.resultLabel} onChange={(e) => handleTextChange('footer', 'resultLabel', e.target.value)} className="w-20 outline-none bg-transparent uppercase" style={{ color: templateConfig.theme.redLabels, textShadow: "0.5px 0.5px 0px rgba(0,0,0,0.05)" }} />
                   <span className="font-mono text-slate-600 border-b-2 border-slate-400 w-32 px-2 inline-block">{'{{Pass/Fail}}'}</span>
                </div>
                <div className="flex items-center gap-2">
                   <input type="text" value={templateConfig.footer.resultValue} onChange={(e) => handleTextChange('footer', 'resultValue', e.target.value)} className="w-48 outline-none bg-transparent uppercase text-right" style={{ color: templateConfig.theme.redLabels, textShadow: "0.5px 0.5px 0px rgba(0,0,0,0.05)" }} />
                   <span className="font-mono text-slate-600 border-b-2 border-slate-400 w-24 px-2 inline-block">{'{{Class}}'}</span>
                </div>
             </div>

             <div className="flex justify-between items-end px-2 text-slate-800">
                <input type="text" value={templateConfig.footer.dateLabel} onChange={(e) => handleTextChange('footer', 'dateLabel', e.target.value)} className="w-48 outline-none bg-transparent" style={{ color: templateConfig.theme.tableHeaderBg }}/>
                <input type="text" value={templateConfig.footer.teacherLabel} onChange={(e) => handleTextChange('footer', 'teacherLabel', e.target.value)} className="w-48 text-center outline-none bg-transparent" style={{ color: templateConfig.theme.tableHeaderBg }}/>
                <input type="text" value={templateConfig.footer.principalLabel} onChange={(e) => handleTextChange('footer', 'principalLabel', e.target.value)} className="w-48 text-right outline-none bg-transparent" style={{ color: templateConfig.theme.tableHeaderBg }}/>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
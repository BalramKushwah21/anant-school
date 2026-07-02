"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, Settings2, PlusCircle } from "lucide-react";

export default function SimpleTemplate() {
  // 🗄️ MASTER JSON CONFIGURATION
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_xaviers_001",
    templateName: "CBSE Detailed Assessment Format",
    theme: {
      schoolNameColor: "#b91c1c", // Deep Red
      textColor: "#1e3a8a", // Navy Blue
      tableHeaderBg: "#1e3a8a", // Navy Blue
      infoBoxBg: "#eff6ff", // Light Blue
    },
    header: {
      schoolName: "ST. XAVIER'S HIGH SCHOOL",
      address: "Patia, Bhubaneswar - 751024",
      contact: "Ph.: 0674-1234567, Email: info@stxaviers.edu.in",
      affiliation: "Affiliated to CBSE, New Delhi (Affiliation No. 1530XXX)",
      title: "REPORT CARD",
      sessionLabel: "ACADEMIC SESSION :",
      sessionValue: "2023-24",
    },
    // DYNAMIC TERMS (Fixed for this specific layout, but sub-columns can be adjusted)
    terms: [
      { id: "t1", name: "Term - 1 (100 Marks)" },
      { id: "t2", name: "Term - 2 (100 Marks)" }
    ],
    // DYNAMIC SUBJECTS (Rows)
    subjects: [
      { id: "sub_1", name: "ENGLISH" },
      { id: "sub_2", name: "HINDI / ODIA" },
      { id: "sub_3", name: "MATHEMATICS" },
      { id: "sub_4", name: "SCIENCE" },
      { id: "sub_5", name: "SOCIAL SCIENCE" },
      { id: "sub_6", name: "INFORMATION TECH." },
    ],
    coScholastic: [
      { id: "co_1", name: "Work Education" },
      { id: "co_2", name: "Art Education" },
      { id: "co_3", name: "Health & Physical Education" },
    ],
    discipline: [
      { id: "d_1", name: "Discipline" }
    ],
    footer: {
      remarks: "Has performed well. Keep it up!",
      result: "Promoted to Class X",
      date: "31/03/2024",
      signatures: ["Class Teacher", "Principal", "Parent's Signature"]
    }
  });

  // ================= ACTION HANDLERS =================

  const handleTextChange = (section, field, value) => {
    setTemplateConfig({ ...templateConfig, [section]: { ...templateConfig[section], [field]: value } });
  };

  const addSubject = (type) => {
    const newId = `item_${Date.now()}`;
    if (type === 'scholastic') setTemplateConfig({ ...templateConfig, subjects: [...templateConfig.subjects, { id: newId, name: "New Subject" }] });
    else if (type === 'co') setTemplateConfig({ ...templateConfig, coScholastic: [...templateConfig.coScholastic, { id: newId, name: "New Activity" }] });
  };

  const updateSubject = (type, id, value) => {
    if (type === 'scholastic') setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.map(s => s.id === id ? { ...s, name: value } : s) });
    else if (type === 'co') setTemplateConfig({ ...templateConfig, coScholastic: templateConfig.coScholastic.map(s => s.id === id ? { ...s, name: value } : s) });
  };

  const removeRow = (type, id) => {
    if (type === 'scholastic') setTemplateConfig({ ...templateConfig, subjects: templateConfig.subjects.filter(s => s.id !== id) });
    else if (type === 'co') setTemplateConfig({ ...templateConfig, coScholastic: templateConfig.coScholastic.filter(s => s.id !== id) });
  };

  const handleSave = () => {
    console.log("Saving Xavier Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("✨ CBSE Detailed Template Saved! Ready for database merging.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-blue-700"/>
            <span className="font-bold text-lg">Detailed Assessment Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Click text to edit • Hover over rows to add/delete</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <label className="text-xs font-bold text-slate-600">Theme:</label>
             <input type="color" value={templateConfig.theme.schoolNameColor} onChange={(e) => setTemplateConfig({...templateConfig, theme: {...templateConfig.theme, schoolNameColor: e.target.value}})} className="w-5 h-5 rounded cursor-pointer border-none p-0" title="School Name Color"/>
             <input type="color" value={templateConfig.theme.tableHeaderBg} onChange={(e) => setTemplateConfig({...templateConfig, theme: {...templateConfig.theme, tableHeaderBg: e.target.value}})} className="w-5 h-5 rounded cursor-pointer border-none p-0" title="Header Box Color"/>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
            <Save size={16} /> Save Format
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[10mm] relative">
        <div className="w-full h-full border border-slate-300 p-2 relative flex flex-col">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-start mb-2 relative">
            <div className="w-24 h-24 flex items-center justify-center bg-slate-50 group cursor-pointer border-2 border-dashed border-slate-300 ml-4 mt-2">
               <ImageIcon size={24} className="text-slate-400 group-hover:hidden" />
               <span className="hidden group-hover:block text-[10px] font-bold text-slate-500 text-center px-1">Upload Logo</span>
            </div>

            <div className="flex-1 text-center px-4">
              <input type="text" value={templateConfig.header.schoolName} onChange={(e) => handleTextChange('header', 'schoolName', e.target.value)}
                className="w-full text-3xl font-black uppercase text-center outline-none bg-transparent tracking-wide"
                style={{ color: templateConfig.theme.schoolNameColor }} />
              
              <input type="text" value={templateConfig.header.address} onChange={(e) => handleTextChange('header', 'address', e.target.value)}
                className="w-full text-[13px] font-bold text-center outline-none bg-transparent mt-1"
                style={{ color: templateConfig.theme.textColor }}/>
              
              <input type="text" value={templateConfig.header.contact} onChange={(e) => handleTextChange('header', 'contact', e.target.value)}
                className="w-full text-[12px] text-center outline-none bg-transparent mt-0.5"
                style={{ color: templateConfig.theme.textColor }}/>

              <input type="text" value={templateConfig.header.affiliation} onChange={(e) => handleTextChange('header', 'affiliation', e.target.value)}
                className="w-full text-[11px] font-bold text-center outline-none bg-transparent mt-0.5"
                style={{ color: templateConfig.theme.textColor }}/>

              <div className="flex justify-center mt-3">
                <input type="text" value={templateConfig.header.title} onChange={(e) => handleTextChange('header', 'title', e.target.value)}
                  className="text-lg font-bold text-center outline-none px-6 py-0.5 rounded-full text-white tracking-widest shadow-sm"
                  style={{ backgroundColor: templateConfig.theme.schoolNameColor }}/>
              </div>

              <div className="flex items-center justify-center gap-2 mt-2 font-bold text-[13px]" style={{ color: templateConfig.theme.textColor }}>
                 <input type="text" value={templateConfig.header.sessionLabel} onChange={(e) => handleTextChange('header', 'sessionLabel', e.target.value)} className="w-40 text-right outline-none bg-transparent" />
                 <input type="text" value={templateConfig.header.sessionValue} onChange={(e) => handleTextChange('header', 'sessionValue', e.target.value)} className="w-24 text-left outline-none bg-transparent" />
              </div>
            </div>

            <div className="w-20 h-24 border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-[10px] font-bold text-slate-400 text-center p-2 mr-4 mt-2">
              Student Photo
            </div>
          </div>

          {/* STUDENT INFO BOX */}
          <div className="border border-slate-400 p-2 text-[11px] font-semibold mb-4" style={{ backgroundColor: templateConfig.theme.infoBoxBg, color: templateConfig.theme.textColor }}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
               <div className="flex"><span className="w-32">Admission No.</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.admNo}}'}</span></div>
               <div className="flex"><span className="w-32">Roll No.</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.rollNo}}'}</span></div>
               <div className="flex"><span className="w-32">Student's Name</span> <span className="flex-1 font-bold uppercase text-slate-900">: {'{{student.name}}'}</span></div>
               <div className="flex"><span className="w-32">Class / Sec</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.class}}'}</span></div>
               <div className="flex"><span className="w-32">Mother's Name</span> <span className="flex-1 font-bold uppercase text-slate-800">: {'{{student.motherName}}'}</span></div>
               <div className="flex"><span className="w-32">Date of Birth</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.dob}}'}</span></div>
               <div className="flex"><span className="w-32">Father's Name</span> <span className="flex-1 font-bold uppercase text-slate-800">: {'{{student.fatherName}}'}</span></div>
               <div className="flex"><span className="w-32">Blood Group</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.bloodGroup}}'}</span></div>
               <div className="col-span-2 flex"><span className="w-32">Address</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.address}}'}</span></div>
               <div className="col-span-2 flex"><span className="w-32">Phone No.</span> <span className="flex-1 font-mono text-slate-800">: {'{{student.phone}}'}</span></div>
            </div>
          </div>

          {/* ===================== PART 1: SCHOLASTIC TABLE ===================== */}
          <div className="mb-4 relative group flex-1">
            <button onClick={() => addSubject('scholastic')} className="absolute -left-6 top-10 text-blue-700  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden transition-all z-20" title="Add Subject"><PlusCircle size={20}/></button>

            <div contentEditable suppressContentEditableWarning className="font-bold text-white px-2 py-1 text-xs" style={{ backgroundColor: templateConfig.theme.tableHeaderBg }}>
               Part 1 : Scholastic Area
            </div>
            <table className="w-full border-collapse border border-slate-400 text-[8px] text-center" style={{ color: templateConfig.theme.textColor }}>
              <thead>
                {/* Row 1: Term Headers */}
                <tr>
                  <th className="border border-slate-400 p-1 w-[15%]" rowSpan="2">Subject Name</th>
                  <th contentEditable suppressContentEditableWarning className="border border-slate-400 p-1" colSpan="7">{templateConfig.terms[0].name}</th>
                  <th contentEditable suppressContentEditableWarning className="border border-slate-400 p-1" colSpan="7">{templateConfig.terms[1].name}</th>
                  <th contentEditable suppressContentEditableWarning className="border border-slate-400 p-1" colSpan="2">OVER ALL</th>
                </tr>
                
                {/* Row 2: Sub Headers */}
                <tr contentEditable suppressContentEditableWarning className="bg-slate-50/50">
                  {/* Term 1 */}
                  <th className="border border-slate-400 p-0.5">PT<br/>(10)</th>
                  <th className="border border-slate-400 p-0.5">Mult.<br/>Asses(5)</th>
                  <th className="border border-slate-400 p-0.5">Port<br/>(5)</th>
                  <th className="border border-slate-400 p-0.5">Sub.<br/>En(5)</th>
                  <th className="border border-slate-400 p-0.5">Half<br/>Yrly(80)</th>
                  <th className="border border-slate-400 p-0.5 text-slate-900 bg-slate-100">Marks<br/>Obt(100)</th>
                  <th className="border border-slate-400 p-0.5">Gr.</th>
                  {/* Term 2 */}
                  <th className="border border-slate-400 p-0.5">PT<br/>(10)</th>
                  <th className="border border-slate-400 p-0.5">Mult.<br/>Asses(5)</th>
                  <th className="border border-slate-400 p-0.5">Port<br/>(5)</th>
                  <th className="border border-slate-400 p-0.5">Sub.<br/>En(5)</th>
                  <th className="border border-slate-400 p-0.5">Yrly<br/>(80)</th>
                  <th className="border border-slate-400 p-0.5 text-slate-900 bg-slate-100">Marks<br/>Obt(100)</th>
                  <th className="border border-slate-400 p-0.5">Gr.</th>
                  {/* Overall */}
                  <th className="border border-slate-400 p-0.5 text-slate-900 bg-slate-100">Marks<br/>Obt(100)</th>
                  <th className="border border-slate-400 p-0.5">Gr.</th>
                </tr>
              </thead>
              <tbody>
                {templateConfig.subjects.map((sub, i) => (
                  <tr key={sub.id} className="group/row hover:bg-slate-50 font-medium">
                    <td className="border border-slate-400 p-1 text-left relative flex items-center">
                      <button onClick={() => removeRow('scholastic', sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                      <span className="w-3 text-[7px] text-slate-400">{i+1}.</span>
                      <input type="text" value={sub.name} onChange={(e) => updateSubject('scholastic', sub.id, e.target.value)} className="w-full outline-none bg-transparent uppercase font-bold text-slate-800"/>
                    </td>
                    
                    {/* Data Columns (Term 1 & 2 logic mapped dynamically via placeholders) */}
                    {[...Array(2)].map((_, termIdx) => (
                       <React.Fragment key={termIdx}>
                          <td className="border border-slate-400 p-1 text-slate-500">{'{{db}}'}</td>
                          <td className="border border-slate-400 p-1 text-slate-500">{'{{db}}'}</td>
                          <td className="border border-slate-400 p-1 text-slate-500">{'{{db}}'}</td>
                          <td className="border border-slate-400 p-1 text-slate-500">{'{{db}}'}</td>
                          <td className="border border-slate-400 p-1 text-slate-500">{'{{db}}'}</td>
                          <td className="border border-slate-400 p-1 text-slate-800 font-bold bg-slate-50">{'{{Tot}}'}</td>
                          <td className="border border-slate-400 p-1 font-bold text-slate-800">{'{{G}}'}</td>
                       </React.Fragment>
                    ))}
                    {/* Overall */}
                    <td className="border border-slate-400 p-1 text-slate-900 font-bold bg-slate-100">{'{{Grand}}'}</td>
                    <td className="border border-slate-400 p-1 font-bold text-slate-900">{'{{G}}'}</td>
                  </tr>
                ))}
                
                {/* Grand Total Row */}
                <tr className="bg-slate-50 font-bold text-[9px]" style={{ color: templateConfig.theme.textColor }}>
                   <td className="border border-slate-400 p-1 text-right pr-2">Grand Total</td>
                   <td className="border border-slate-400 p-1" colSpan="5"></td>
                   <td className="border border-slate-400 p-1 bg-slate-100">{'{{T1_Sum}}'}</td>
                   <td className="border border-slate-400 p-1"></td>
                   <td className="border border-slate-400 p-1" colSpan="5"></td>
                   <td className="border border-slate-400 p-1 bg-slate-100">{'{{T2_Sum}}'}</td>
                   <td className="border border-slate-400 p-1"></td>
                   <td className="border border-slate-400 p-1 bg-slate-200">{'{{Final}}'}</td>
                   <td className="border border-slate-400 p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ===================== PART 2 & 3: CO-SCHOLASTIC & DISCIPLINE ===================== */}
          <div className="mb-4">
             <div contentEditable suppressContentEditableWarning className="font-bold text-white px-2 py-1 text-xs" style={{ backgroundColor: templateConfig.theme.tableHeaderBg }}>
               Part 2 : Co-Scholastic Activities (To be assessed on a 3 point scale)
             </div>
             <table className="w-full border-collapse border border-slate-400 text-[9px] bg-white text-center" style={{ color: templateConfig.theme.textColor }}>
               <thead contentEditable suppressContentEditableWarning>
                 <tr className="bg-slate-50 font-bold">
                   <th className="border border-slate-400 p-1 text-left w-1/2">Activity</th>
                   <th className="border border-slate-400 p-1">Term-1 Grade</th>
                   <th className="border border-slate-400 p-1">Term-2 Grade</th>
                 </tr>
               </thead>
               <tbody>
                  {templateConfig.coScholastic.map((item) => (
                     <tr key={item.id} className="relative group/row hover:bg-slate-50">
                        <td className="border border-slate-400 p-1 relative text-left">
                           <button onClick={() => removeRow('co', item.id)} className="absolute -left-6 bg-red-100 text-red-600 p-0.5 rounded opacity-100 sm:opacity-0 sm: group-hover/row:opacity-100 print:hidden"><Trash2 size={10}/></button>
                           <input type="text" value={item.name} onChange={(e) => updateSubject('co', item.id, e.target.value)} className="w-full outline-none bg-transparent font-medium"/>
                        </td>
                        <td className="border border-slate-400 p-1 text-slate-600 font-bold">{'{{G}}'}</td>
                        <td className="border border-slate-400 p-1 text-slate-600 font-bold">{'{{G}}'}</td>
                     </tr>
                  ))}
               </tbody>
             </table>

             {/* Discipline Area directly attached */}
             <div className="font-bold text-white px-2 py-1 text-xs mt-2" style={{ backgroundColor: templateConfig.theme.tableHeaderBg }}>
               Part 3 : Discipline (To be assessed on a 3 point scale)
             </div>
             <table className="w-full border-collapse border border-slate-400 text-[9px] bg-white text-center" style={{ color: templateConfig.theme.textColor }}>
               <tbody>
                 {templateConfig.discipline.map((item) => (
                     <tr key={item.id} className="font-bold bg-slate-50/50">
                        <td className="border border-slate-400 p-1 text-left w-1/2 uppercase tracking-wide">{item.name}</td>
                        <td className="border border-slate-400 p-1 text-slate-600">{'{{G}}'}</td>
                        <td className="border border-slate-400 p-1 text-slate-600">{'{{G}}'}</td>
                     </tr>
                  ))}
               </tbody>
             </table>
          </div>

          {/* ===================== FOOTER / REMARKS / SIGNATURES ===================== */}
          <div className="mt-auto border border-slate-400 p-2 text-sm text-slate-800 bg-white" style={{ borderColor: templateConfig.theme.textColor }}>
             <div className="flex items-center gap-2 mb-2 font-bold text-xs" style={{ color: templateConfig.theme.textColor }}>
                <span>Remarks :</span>
                <input type="text" value={templateConfig.footer.remarks} onChange={(e) => handleTextChange('footer', 'remarks', e.target.value)} className="flex-1 outline-none bg-transparent text-slate-800 border-b border-dotted border-slate-400"/>
             </div>
             <div className="flex items-center gap-2 mb-8 font-bold text-xs" style={{ color: templateConfig.theme.textColor }}>
                <span>Result :</span>
                <input type="text" value={templateConfig.footer.result} onChange={(e) => handleTextChange('footer', 'result', e.target.value)} className="flex-1 outline-none bg-transparent text-slate-800 border-b border-dotted border-slate-400"/>
             </div>

             <div className="flex justify-between items-end px-4 font-bold text-[11px] uppercase" style={{ color: templateConfig.theme.textColor }}>
                <div className="w-32 text-center flex flex-col items-center">
                   <input type="text" value={templateConfig.footer.date} onChange={(e) => handleTextChange('footer', 'date', e.target.value)} className="w-full text-center outline-none bg-transparent mb-1 text-slate-800"/>
                   <span className="border-t border-slate-400 w-full pt-1">Date</span>
                </div>
                {templateConfig.footer.signatures.map((sig, idx) => (
                   <div key={idx} className="w-32 text-center border-t border-slate-400 pt-1">
                      <input type="text" value={sig} onChange={(e) => {
                         const newSigs = [...templateConfig.footer.signatures]; newSigs[idx] = e.target.value;
                         setTemplateConfig({...templateConfig, footer: {...templateConfig.footer, signatures: newSigs}});
                      }} className="w-full text-center outline-none bg-transparent tracking-wider"/>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
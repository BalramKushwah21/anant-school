"use client";
import React, { useState } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, PlusCircle, Settings2 } from "lucide-react";

export default function StateBoardTemplate() {
  // 🗄️ MASTER JSON CONFIGURATION
  const [templateConfig, setTemplateConfig] = useState({
    templateId: "tpl_stateboard_up",
    templateName: "State Board Detailed Format",
    theme: {
      schoolNameColor: "#1e3a8a", // Dark Blue
      addressColor: "#15803d", // Green
      reportCardBg: "#fce7f3", // Pink
      studentInfoBg: "#ecfeff", // Cyan light
      tableHeaderBg: "#fef9c3", // Yellow light
      redLabels: "#b91c1c", // Red
      blueLabels: "#1d4ed8", // Blue
    },
    header: {
      schoolName: "J N INTER COLLEGE",
      address: "Gopalpura, Bhadrauli, Bah, Agra (U.P)",
      title: "REPORT CARD",
      sessionLabel: "ACADEMIC SESSION:",
      sessionValue: "2022-23",
      classValue: "1st-A"
    },
    // DYNAMIC EXAMS/TERMS (Admin can add more terms)
    terms: [
      { id: "term_1", name: "First Terminal Exam", maxMarks: 100 },
      { id: "term_2", name: "Second Terminal Exam", maxMarks: 100 },
      { id: "term_3", name: "Annual Exam", maxMarks: 100 },
    ],
    // DYNAMIC SUBJECTS (Rows)
    subjects: [
      { id: "sub_1", name: "HINDI" },
      { id: "sub_2", name: "ENGLISH" },
      { id: "sub_3", name: "MATHS" },
      { id: "sub_4", name: "SCIENCE" },
      { id: "sub_5", name: "SANSKRIT" },
    ],
    summary: {
      behavior: "GOOD",
      result: "FAIL",
      division: "-",
      remark: "-"
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

  // --- TERMS (Columns) LOGIC ---
  const addTerm = () => {
    const newTerm = { id: `term_${Date.now()}`, name: "New Exam", maxMarks: 100 };
    setTemplateConfig({ ...templateConfig, terms: [...templateConfig.terms, newTerm] });
  };

  const updateTerm = (id, field, value) => {
    setTemplateConfig({
      ...templateConfig,
      terms: templateConfig.terms.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const removeTerm = (id) => {
    setTemplateConfig({ ...templateConfig, terms: templateConfig.terms.filter(t => t.id !== id) });
  };

  const handleSave = () => {
    console.log("Saving State Board Layout to DB:", JSON.stringify(templateConfig, null, 2));
    alert("Template Structure Saved! Ready for database mapping.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center font-sans">
      
      {/* ===================== CONTROL BAR ===================== */}
      <div className="w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-slate-200 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 size={20} className="text-indigo-600"/>
            <span className="font-bold text-lg">State Board Layout Builder</span> 
          </div>
          <span className="text-xs text-slate-500 mt-1">Click text to edit • Hover over rows/cols to Add/Delete</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={addTerm} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-200">
            <PlusCircle size={16} /> Add Term/Exam
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      {/* ===================== A4 CANVAS ===================== */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[10mm] relative">
        {/* Outer Double Border */}
        <div className="w-full h-full border-[5px] border-double border-slate-800 p-2 relative flex flex-col">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-start mb-2 relative">
            <div className="w-24 h-24 border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 group cursor-pointer hover:bg-slate-100 transition-all absolute left-0 top-0">
               <ImageIcon size={24} className="text-slate-400 group-hover:hidden" />
               <span className="hidden group-hover:block text-[10px] font-bold text-slate-500 text-center px-1">Upload Logo</span>
            </div>

            <div className="flex-1 text-center px-28">
              <input type="text" value={templateConfig.header.schoolName} onChange={(e) => handleTextChange('header', 'schoolName', e.target.value)}
                className="w-full text-[32px] font-black uppercase text-center outline-none hover:bg-slate-50 focus:bg-white rounded tracking-wide"
                style={{ color: templateConfig.theme.schoolNameColor }} />
              
              <input type="text" value={templateConfig.header.address} onChange={(e) => handleTextChange('header', 'address', e.target.value)}
                className="w-full text-sm font-bold text-center outline-none hover:bg-slate-50 mt-1"
                style={{ color: templateConfig.theme.addressColor }}/>
              
              <div className="flex justify-center mt-3 mb-2">
                <input type="text" value={templateConfig.header.title} onChange={(e) => handleTextChange('header', 'title', e.target.value)}
                  className="text-lg font-bold text-center outline-none border border-slate-800 px-8 py-1.5"
                  style={{ backgroundColor: templateConfig.theme.reportCardBg, color: templateConfig.theme.blueLabels }}/>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-bold">
                 <input type="text" value={templateConfig.header.sessionLabel} onChange={(e) => handleTextChange('header', 'sessionLabel', e.target.value)} className="w-40 text-right outline-none bg-transparent uppercase" style={{ color: templateConfig.theme.redLabels }} />
                 <input type="text" value={templateConfig.header.sessionValue} onChange={(e) => handleTextChange('header', 'sessionValue', e.target.value)} className="w-24 text-left outline-none bg-transparent" />
              </div>
              <div className="flex items-center justify-center gap-1 text-sm font-bold mt-1">
                 <span className="uppercase" style={{ color: templateConfig.theme.redLabels }}>CLASS:</span>
                 <input type="text" value={templateConfig.header.classValue} onChange={(e) => handleTextChange('header', 'classValue', e.target.value)} className="w-20 outline-none bg-transparent" />
              </div>
            </div>

            <div className="w-24 h-28 border border-slate-800 flex items-center justify-center bg-slate-50 text-xs text-slate-400 font-semibold text-center p-2 absolute right-0 top-0">
              [Student Photo Map]
            </div>
          </div>

          {/* STUDENT INFO BOX */}
          <div className="border border-slate-800 p-3 grid grid-cols-12 gap-2 text-xs font-bold mb-4" style={{ backgroundColor: templateConfig.theme.studentInfoBg }}>
            <div className="col-span-8 grid grid-cols-4 gap-y-2">
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1">STUDENT'S NAME</span>
               <span className="col-span-3 flex">: <span className="ml-2 font-semibold text-slate-700">{'{{student.name}}'}</span></span>
               
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1">MOTHER'S NAME</span>
               <span className="col-span-3 flex">: <span className="ml-2 font-semibold text-slate-700">{'{{student.motherName}}'}</span></span>
               
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1">FATHER'S NAME</span>
               <span className="col-span-3 flex">: <span className="ml-2 font-semibold text-slate-700">{'{{student.fatherName}}'}</span></span>
               
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1">ADDRESS</span>
               <span className="col-span-3 flex">: <span className="ml-2 font-semibold text-slate-700 uppercase">{'{{student.address}}'}</span></span>
            </div>
            <div className="col-span-4 grid grid-cols-3 gap-y-2">
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1 text-right">ROLL NO</span>
               <span className="col-span-2 flex ml-2">: <span className="ml-2 font-semibold text-slate-700">{'{{student.rollNo}}'}</span></span>
               
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1 text-right">DATE OF BIRTH</span>
               <span className="col-span-2 flex ml-2">: <span className="ml-2 font-semibold text-slate-700">{'{{student.dob}}'}</span></span>
               
               <span style={{ color: templateConfig.theme.redLabels }} className="col-span-1 text-right">IN WORDS</span>
               <span className="col-span-2 flex ml-2 leading-tight">: <span className="ml-2 font-semibold text-slate-700 uppercase">{'{{student.dobWords}}'}</span></span>
            </div>
          </div>

          {/* ===================== MARKS TABLE ===================== */}
          <div className="relative group mb-4 flex-1">
            <button onClick={addSubject} className="absolute -left-8 top-1/2 bg-indigo-600 text-white p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden transition-all shadow-md z-10" title="Add Subject Row"><Plus size={16}/></button>
            
            <table className="w-full border-collapse border border-slate-800 text-[10px] text-center font-bold">
              <thead style={{ backgroundColor: templateConfig.theme.tableHeaderBg }}>
                {/* Header Row 1 */}
                <tr>
                  <th rowSpan="3" className="border border-slate-800 w-8">Sr.<br/>No.</th>
                  <th rowSpan="3" className="border border-slate-800 w-32" style={{ color: templateConfig.theme.redLabels }}>SUBJECTS</th>
                  {templateConfig.terms.map((term) => (
                    <th key={term.id} colSpan="4" className="border border-slate-800 p-1 relative group/term">
                      <input type="text" value={term.name} onChange={(e) => updateTerm(term.id, 'name', e.target.value)} className="w-full text-center outline-none bg-transparent" style={{ color: templateConfig.theme.blueLabels }}/>
                      <button onClick={() => removeTerm(term.id)} className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={12}/></button>
                    </th>
                  ))}
                  <th colSpan="2" className="border border-slate-800 p-1">Total</th>
                </tr>
                
                {/* Header Row 2 */}
                <tr contentEditable suppressContentEditableWarning >
                  {templateConfig.terms.map((term) => (
                    <React.Fragment key={`${term.id}_r2`}>
                      <th rowSpan="2" className="border border-slate-800 p-1" style={{ color: templateConfig.theme.redLabels }}>
                        MAX<br/>MARKS
                      </th>
                      <th colSpan="3" className="border border-slate-800 p-1" style={{ color: templateConfig.theme.blueLabels }}>
                        Obtain marks
                      </th>
                    </React.Fragment>
                  ))}
                  <th rowSpan="2" className="border border-slate-800 p-1" style={{ color: templateConfig.theme.redLabels }}>Grand<br/>Total</th>
                  <th rowSpan="2" className="border border-slate-800 p-1" style={{ color: templateConfig.theme.redLabels }}>Obtain<br/>Marks</th>
                </tr>

                {/* Header Row 3 */}
                <tr>
                  {templateConfig.terms.map((term) => (
                    <React.Fragment key={`${term.id}_r3`}>
                      <th className="border border-slate-800 p-1" style={{ color: templateConfig.theme.blueLabels }}>I</th>
                      <th className="border border-slate-800 p-1" style={{ color: templateConfig.theme.blueLabels }}>II</th>
                      <th className="border border-slate-800 p-1 text-slate-800">Total</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Dynamic Subject Rows */}
                {templateConfig.subjects.map((sub, index) => (
                  <tr key={sub.id} className="group/row hover:bg-slate-50">
                    <td className="border border-slate-800 p-1.5">{index + 1}</td>
                    <td className="border border-slate-800 p-1 relative text-left pl-2">
                      <button onClick={() => removeSubject(sub.id)} className="absolute -left-6 bg-red-100 text-red-600 p-1 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 print:hidden"><Trash2 size={10}/></button>
                      <input type="text" value={sub.name} onChange={(e) => updateSubject(sub.id, e.target.value)} className="w-full outline-none uppercase bg-transparent"/>
                    </td>
                    
                    {/* Map placeholders for each term */}
                    {templateConfig.terms.map((term) => (
                      <React.Fragment key={`${sub.id}_${term.id}`}>
                        <td className="border border-slate-800 p-1.5"><input type="number" value={term.maxMarks} onChange={(e) => updateTerm(term.id, 'maxMarks', e.target.value)} className="w-8 text-center outline-none bg-transparent font-bold text-slate-800"/></td>
                        <td className="border border-slate-800 p-1.5 font-medium text-slate-600 font-mono">{'{{db}}'}</td>
                        <td className="border border-slate-800 p-1.5 font-medium text-slate-600 font-mono">{'{{db}}'}</td>
                        <td className="border border-slate-800 p-1.5 text-slate-800">{'{{tot}}'}</td>
                      </React.Fragment>
                    ))}
                    
                    {/* Row Grand Total */}
                    <td className="border border-slate-800 p-1.5">{templateConfig.terms.reduce((acc, curr) => acc + Number(curr.maxMarks), 0)}</td>
                    <td className="border border-slate-800 p-1.5 text-slate-800">{'{{tot}}'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================== SUMMARY TABLES ===================== */}
          <div className="grid grid-cols-12 gap-4 text-[11px] font-bold">
            
            {/* Total Marks / Percentage Table */}
            <div className="col-span-7">
              <table className="w-full border-collapse border border-slate-800 text-center">
                <thead>
                  <tr>
                    <th colSpan={templateConfig.terms.length + 1} className="border border-slate-800 p-1.5" style={{ backgroundColor: templateConfig.theme.reportCardBg }}>
                      Total Marks / Percentage
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: templateConfig.theme.reportCardBg, color: templateConfig.theme.blueLabels }}>
                    {templateConfig.terms.map(t => <th key={`head_${t.id}`} className="border border-slate-800 p-1">{t.name.split(' ')[0]} Term</th>)}
                    <th className="border border-slate-800 p-1 text-slate-800">G.Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {templateConfig.terms.map(t => <td key={`mark_${t.id}`} className="border border-slate-800 p-1.5 font-mono text-slate-600">{'{{db}}'}/{t.maxMarks}</td>)}
                    <td className="border border-slate-800 p-1.5 font-mono">{'{{db}}'}/{templateConfig.terms.reduce((acc, curr) => acc + Number(curr.maxMarks), 0)}</td>
                  </tr>
                  <tr>
                    {templateConfig.terms.map(t => <td key={`perc_${t.id}`} className="border border-slate-800 p-1.5 font-mono text-slate-600">{'{{%}}'}</td>)}
                    <td className="border border-slate-800 p-1.5 font-mono text-slate-800">{'{{%}}'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Behavior & Result Table */}
            <div className="col-span-5">
              <table className="w-full border-collapse border border-slate-800 text-left">
                <tbody>
                  <tr>
                    <td className="border border-slate-800 p-1.5 w-24 uppercase" style={{ color: templateConfig.theme.blueLabels }}>BEHAVIOR</td>
                    <td className="border border-slate-800 p-1.5 w-1 text-center">:</td>
                    <td className="border border-slate-800 p-1.5 text-center">
                      <input type="text" value={templateConfig.summary.behavior} onChange={(e) => handleTextChange('summary', 'behavior', e.target.value)} className="w-full text-center outline-none bg-transparent uppercase text-slate-800"/>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-1.5 uppercase" style={{ color: templateConfig.theme.blueLabels }}>RESULT</td>
                    <td className="border border-slate-800 p-1.5 text-center">:</td>
                    <td className="border border-slate-800 p-1.5 text-center">
                      <input type="text" value={templateConfig.summary.result} onChange={(e) => handleTextChange('summary', 'result', e.target.value)} className="w-full text-center outline-none bg-transparent uppercase text-slate-800"/>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-1.5 uppercase" style={{ color: templateConfig.theme.blueLabels }}>DIVISION</td>
                    <td className="border border-slate-800 p-1.5 text-center">:</td>
                    <td className="border border-slate-800 p-1.5 text-center">
                      <input type="text" value={templateConfig.summary.division} onChange={(e) => handleTextChange('summary', 'division', e.target.value)} className="w-full text-center outline-none bg-transparent uppercase text-slate-800"/>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-1.5 uppercase" style={{ color: templateConfig.theme.blueLabels }}>REMARK</td>
                    <td className="border border-slate-800 p-1.5 text-center">:</td>
                    <td className="border border-slate-800 p-1.5 text-center">
                      <input type="text" value={templateConfig.summary.remark} onChange={(e) => handleTextChange('summary', 'remark', e.target.value)} className="w-full text-center outline-none bg-transparent uppercase text-slate-800"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* ===================== FOOTER SIGNATURES ===================== */}
          <div className="flex justify-between items-end px-4 mt-auto pt-16 pb-4 font-bold text-xs text-slate-800">
             <div className="text-center w-32 border-t border-dashed border-slate-800 pt-1">Date</div>
             <div className="text-center w-32 border-t border-dashed border-slate-800 pt-1">Class Teacher</div>
             <div className="text-center w-32 border-t border-dashed border-slate-800 pt-1">Checked By</div>
             <div className="text-center w-32 border-t border-dashed border-slate-800 pt-1">Principal</div>
          </div>

        </div>
      </div>
    </div>
  );
}
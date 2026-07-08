"use client";
import React, { useState, useEffect } from "react";
import { Filter, Columns, Download, Plus, Trash2 } from "lucide-react";

// Standard fields that always exist in the Student table
const STATIC_FIELDS = [
  { key: "name", label: "Student Name", isCustom: false },
  { key: "rollNo", label: "Roll Number", isCustom: false },
  { key: "class", label: "Class", isCustom: false },
  { key: "section", label: "Section", isCustom: false },
];

export default function StudentRecordsGrid() {
  const [allFields, setAllFields] = useState(STATIC_FIELDS);
  const [filters, setFilters] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(["name", "rollNo", "class"]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Custom Fields on Load
  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/settings/custom-fields");
      const json = await res.json();
      if (json.success) {
        const customMapped = json.data.map(f => ({ key: f.key, label: f.label, isCustom: true }));
        setAllFields([...STATIC_FIELDS, ...customMapped]);
      }
    };
    init();
  }, []);

  // 2. Filter Logic
  const addFilter = () => setFilters([...filters, { field: "class", operator: "EQUALS", value: "", isCustom: false }]);
  
  const updateFilter = (index, key, val) => {
    const newFilters = [...filters];
    newFilters[index][key] = val;
    if (key === "field") {
      newFilters[index].isCustom = allFields.find(f => f.key === val)?.isCustom || false;
    }
    if (key === "operator" && val === "IS_EMPTY") {
      newFilters[index].value = ""; // Clear value if "Without" is selected
    }
    setFilters(newFilters);
  };
  
  const removeFilter = (index) => setFilters(filters.filter((_, i) => i !== index));

  // 3. Fetch Data based on Filters
  const fetchFilteredData = async () => {
    setLoading(true);
    const res = await fetch("/api/students/records", {
      method: "POST",
      body: JSON.stringify({ filters })
    });
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  };

  // 4. Excel Export Logic
  const exportExcel = () => {
    if (data.length === 0) return alert("No data to export!");
    let csv = selectedColumns.map(col => allFields.find(f => f.key === col)?.label).join(",") + "\n";
    
    data.forEach(row => {
      csv += selectedColumns.map(col => {
        const isCustom = allFields.find(f => f.key === col)?.isCustom;
        const val = isCustom ? (row.customData?.[col] || "") : (row[col] || "");
        return `"${val}"`;
      }).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Student_Records_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 max-w-[100vw] overflow-hidden min-h-screen bg-slate-50 flex flex-col gap-6">
      
      {/* HEADER & EXPORT */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Data Grid</h1>
          <p className="text-sm text-slate-500">Filter and manage complete records</p>
        </div>
        <button onClick={exportExcel} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-100">
          <Download size={18}/> Export CSV
        </button>
      </div>

      {/* WORKSPACE: FILTERS & COLUMNS */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* FILTER BUILDER */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">
            <Filter size={18} className="text-indigo-600"/> Rule Builder
          </h2>
          <div className="space-y-3 mb-4">
            {filters.map((f, i) => (
              <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-400 w-8">{i === 0 ? "WHERE" : "AND"}</span>
                <select value={f.field} onChange={e => updateFilter(i, "field", e.target.value)} className="p-2 text-sm border rounded outline-none bg-white">
                  {allFields.map(field => <option key={field.key} value={field.key}>{field.label}</option>)}
                </select>
                <select value={f.operator} onChange={e => updateFilter(i, "operator", e.target.value)} className="p-2 text-sm border rounded outline-none bg-white font-semibold text-indigo-700">
                  <option value="EQUALS">Is Exactly</option>
                  <option value="CONTAINS">Contains</option>
                  <option value="IS_EMPTY">Without (Is Empty)</option>
                </select>
                <input 
                  type="text" disabled={f.operator === "IS_EMPTY"} value={f.value} 
                  onChange={e => updateFilter(i, "value", e.target.value)}
                  placeholder={f.operator === "IS_EMPTY" ? "N/A" : "Value..."} 
                  className="p-2 text-sm border rounded outline-none flex-1 disabled:bg-slate-100"
                />
                <button onClick={() => removeFilter(i)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={addFilter} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-indigo-100">
              <Plus size={16}/> Add Filter
            </button>
            <button onClick={fetchFilteredData} className="ml-auto bg-slate-900 text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-slate-800">
              {loading ? "Running Query..." : "Run Query"}
            </button>
          </div>
        </div>

        {/* COLUMN SELECTOR */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-64 overflow-y-auto">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">
            <Columns size={18} className="text-indigo-600"/> Display Columns
          </h2>
          <div className="flex flex-col gap-2">
            {allFields.map(f => (
              <label key={f.key} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-slate-200">
                <input 
                  type="checkbox" checked={selectedColumns.includes(f.key)}
                  onChange={(e) => setSelectedColumns(prev => e.target.checked ? [...prev, f.key] : prev.filter(c => c !== f.key))}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm font-semibold text-slate-700">{f.label}</span>
                {f.isCustom && <span className="ml-auto text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">CUSTOM</span>}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* EXCEL-LIKE DATA GRID */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 relative">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left whitespace-nowrap min-w-max border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                {selectedColumns.map(colKey => (
                  <th key={colKey} className="p-3 text-xs font-bold text-slate-600 uppercase border-r border-slate-200">
                    {allFields.find(f => f.key === colKey)?.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-indigo-50/30 transition-colors">
                  {selectedColumns.map(colKey => {
                    const isCustom = allFields.find(f => f.key === colKey)?.isCustom;
                    const val = isCustom ? row.customData?.[colKey] : row[colKey];
                    return (
                      <td key={colKey} className="p-3 text-sm text-slate-800 border-r border-slate-100">
                        {val || <span className="text-slate-300">-</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {data.length === 0 && !loading && (
                <tr><td colSpan={selectedColumns.length} className="p-8 text-center text-slate-400">No records found. Setup filters and run query.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
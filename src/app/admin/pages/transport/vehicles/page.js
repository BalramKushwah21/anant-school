"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bus, Plus, Settings2, Search, AlertCircle, Wrench, CheckCircle2 } from "lucide-react";

export default function TransportFleetManager() {
  const { data: session, status: sessionStatus } = useSession();
  
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editingId, setEditingId] = useState(null); // Edit mode check karne ke liye

  // Dynamically pull the real School ID from NextAuth
  const CURRENT_SCHOOL_ID = session?.user?.schoolId || session?.user?.id; 

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Bus",
    capacity: 40,
    driverName: "",
    driverContact: "",
    status: "Active"
  });

  // Fetch Fleet Data only when session is ready
  useEffect(() => {
    if (sessionStatus === "authenticated" && CURRENT_SCHOOL_ID) {
      fetchVehicles();
    } else if (sessionStatus === "unauthenticated") {
      setIsLoading(false);
    }
  }, [sessionStatus, CURRENT_SCHOOL_ID]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/school/transport/vehicles?schoolId=${CURRENT_SCHOOL_ID}`);
      const json = await res.json();
      if (res.ok) {
        setVehicles(json.data || []);
      } else {
        console.error("Failed to load:", json.error);
      }
    } catch (error) {
      console.error("Failed to fetch fleet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!CURRENT_SCHOOL_ID) {
      alert("Authentication error: School ID not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch("/api/school/transport/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, schoolId: CURRENT_SCHOOL_ID })
      });
      
      const json = await res.json();
      
      if (res.ok) {
        setVehicles([json.data, ...vehicles]);
        setIsDrawerOpen(false);
        setFormData({ vehicleNumber: "", vehicleType: "Bus", capacity: 40, driverName: "", driverContact: "", status: "Active" });
      } else {
        alert(json.error || "Failed to save vehicle.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("System Error during submission.");
    }
  };

  const filteredFleet = vehicles.filter(v => 
    v.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.driverName?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleEditClick = (vehicle) => {
  setEditingId(vehicle.id);
  setFormData(vehicle); // Form mein purani values load ho jayengi
  setIsDrawerOpen(true);
};
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bus className="w-6 h-6 text-indigo-600" />
            Fleet Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage school transport vehicles, capacity, and driver allocations.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          disabled={!CURRENT_SCHOOL_ID}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Register Vehicle
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by plate number or driver..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-6 py-4">Vehicle Plate</th>
                <th className="px-6 py-4">Type & Capacity</th>
                <th className="px-6 py-4">Assigned Driver</th>
                <th className="px-6 py-4">Operational Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading || sessionStatus === "loading" ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading fleet data...</td></tr>
              ) : !CURRENT_SCHOOL_ID ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-rose-500 font-medium">Authentication Error: Please log in to view fleet data.</td></tr>
              ) : filteredFleet.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No vehicles registered in the fleet yet.</td></tr>
              ) : (
                filteredFleet.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{vehicle.vehicleNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{vehicle.vehicleType}</span>
                        <span className="text-xs text-slate-500">{vehicle.capacity} Seats</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{vehicle.driverName || "Unassigned"}</span>
                        <span className="text-xs text-slate-500">{vehicle.driverContact || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        vehicle.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {vehicle.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                        {vehicle.status === 'Maintenance' && <Wrench className="w-3 h-3" />}
                        {vehicle.status === 'Inactive' && <AlertCircle className="w-3 h-3" />}
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Edit Fleet</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Drawer for Registration */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Register New Vehicle</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registration / Plate Number *</label>
                <input required type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} placeholder="e.g. MH-04-AB-1234" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    <option>Bus</option>
                    <option>Mini-Van</option>
                    <option>Traveler</option>
                    <option>SUV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Seats) *</label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Driver Allocation (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Name</label>
                    <input type="text" name="driverName" value={formData.driverName} onChange={handleInputChange} placeholder="Assigned Driver" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Contact</label>
                    <input type="tel" name="driverContact" value={formData.driverContact} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="Active">Active & Deployed</option>
                  <option value="Maintenance">Under Maintenance</option>
                  <option value="Inactive">Out of Service</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-colors mt-4">
                Save Vehicle Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
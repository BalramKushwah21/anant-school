"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// Lucide icons for better UI representation
import { User, BookOpen, Clock, Calendar, AlertCircle, FileText, IndianRupee } from "lucide-react";

export default function ParentDashboard() {
  // 1. Session and State Management
  const { data: session, status } = useSession();
  
  const [parentInfo, setParentInfo] = useState({ name: "Loading...", relation: "", familyBalance: "₹ 0" });
  const [children, setChildren] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  // Yahi state pichli baar missing thi, isko ab add kar diya gaya hai
  const [activeChildIndex, setActiveChildIndex] = useState(0); 

  // 2. Fetch Data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Wait for session to load
      if (status === "loading") return;
      
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/school/parents/dashboard?email=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setParentInfo(data.parentInfo);
            setChildren(data.children);
            setAnnouncements(data.announcements);
          }
        } catch (error) {
          console.error("Data fetching error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status]);

  // 3. Loading Screen
  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  // 4. Safe check to get the currently selected child
  const activeChild = children.length > 0 ? children[activeChildIndex] : null;

  // 5. Main Layout Render
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      
      {/* --- Top Header Section --- */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, {parentInfo.name || "Parent"}</h1>
          <p className="text-indigo-100 mt-1">Role: {parentInfo.relation || "Guardian"}</p>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/20 backdrop-blur-sm w-full md:w-auto text-left md:text-right">
          <p className="text-sm text-indigo-100 mb-1">Total Family Dues</p>
          <p className="text-2xl font-bold text-white">{parentInfo.familyBalance || "₹ 0"}</p>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      {children.length === 0 ? (
        // Agar database me koi baccha link nahi hai tab ye dikhega
        <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No Student Records Found</h2>
          <p className="text-gray-500 mt-2">Aapke account se abhi tak koi baccha link nahi hua hai. Kripya school admin se sampark karein.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Student Details (Occupies 2/3 space on large screens) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Child Selector Dropdown */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" /> Select Child
              </h2>
              <select 
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-all cursor-pointer font-medium"
                value={activeChildIndex}
                onChange={(e) => setActiveChildIndex(Number(e.target.value))}
              >
                {children.map((child, index) => (
                  <option key={child.id} value={index}>
                    {child.name} (Class: {child.class})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Child Overview Data */}
            {activeChild && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
                  <img 
                    src={activeChild.avatar} 
                    alt={activeChild.name} 
                    className="w-20 h-20 rounded-full border-4 border-indigo-50 shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{activeChild.name}</h3>
                    <p className="text-indigo-600 font-medium mb-1">Class {activeChild.class}</p>
                    <p className="text-xs text-gray-400 font-mono bg-gray-100 inline-block px-2 py-1 rounded">ID: {activeChild.id}</p>
                  </div>
                </div>

                {/* Quick Stats Grid (Attendance & Fees) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">Attendance</span>
                    </div>
                    <span className="text-3xl font-bold text-emerald-700">{activeChild.attendance}%</span>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col justify-center transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <IndianRupee className="w-4 h-4" />
                      <span className="text-sm font-semibold">Pending Dues</span>
                    </div>
                    <span className="text-2xl font-bold text-red-700">{activeChild.pendingFees}</span>
                  </div>
                </div>

                {/* Academics Overview Card */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" /> Academics Overview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Pending Homework</p>
                        <p className="text-xs text-gray-500 mt-1">{activeChild.homework} assignments due</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Next Exam</p>
                        <p className="text-xs text-gray-500 mt-1">{activeChild.nextExam}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right Column: Notice Board (Occupies 1/3 space on large screens) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" /> Notice Board
            </h2>
            
            {announcements.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                No new announcements
              </p>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        ann.type === 'Event' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {ann.type}
                      </span>
                      <span className="text-xs font-medium text-gray-400">{ann.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 leading-snug">{ann.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
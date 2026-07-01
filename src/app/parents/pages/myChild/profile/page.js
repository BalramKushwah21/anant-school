"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, User, BookOpen, Activity, Bus, 
  MapPin, Phone, Calendar, Droplet, FileText, AlertCircle 
} from "lucide-react";

export default function StudentProfilePage() {
  const { id } = useParams(); // URL se student ID nikalna
  const router = useRouter();
  const { data: session, status } = useSession();

  // States
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, academic, medical, transport

  // Fetch Student Details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (status === "loading") return;
      if (!session?.user?.email) {
        setError("Please login to view profile.");
        setIsLoading(false);
        return;
      }

      try {
        // API Route: Isko apne backend ke hisaab se adjust kar lijiye
        // Example: /api/school/parents/student/[id]?email=...
        const response = await fetch(`/api/school/parents/student/${id}?email=${session.user.email}`);
        
        if (!response.ok) {
          throw new Error("Failed to load student profile");
        }
        
        const data = await response.json();
        
        // Dummy Data Structure (Agar API abhi ready nahi hai toh isko testing ke liye use karein)
        const mockData = {
          id: id,
          firstName: "Aarav",
          lastName: "Sharma",
          dob: "15 May 2010",
          gender: "Male",
          bloodGroup: "O+",
          avatar: `https://ui-avatars.com/api/?name=Aarav+Sharma&background=4F46E5&color=fff&size=150`,
          academics: {
            class: "9th",
            section: "A",
            rollNumber: "45",
            classTeacher: "Ms. Vandana Roy",
            attendance: "92%",
          },
          medical: {
            allergies: "Peanuts",
            medications: "None",
            emergencyContact: "+91 98765 43210",
          },
          transport: {
            route: "Route 04 - City Center",
            stop: "Green Park Avenue",
            vehicleNo: "DL 1P 1234",
            driverName: "Ramesh Kumar",
            driverPhone: "+91 87654 32109",
          }
        };

        // Real API data use karne ke liye: setStudent(data.student)
        setStudent(mockData); 
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id, session, status]);

  // Loading UI
  if (isLoading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-500 font-medium">Loading Profile...</div>
      </div>
    );
  }

  // Error UI
  if (error || !student) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-red-700">Oops! Error</h2>
        <p className="text-red-600 mt-2">{error || "Student not found."}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Go Back
        </button>
      </div>
    );
  }

  // Helper component for rendering info rows safely
  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="mt-0.5 text-indigo-500">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* --- Back Button --- */}
        <button 
          onClick={() => router.push('/parents/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* --- Header Profile Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 h-32 w-full"></div>
          <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 relative">
            <img 
              src={student.avatar} 
              alt={student.firstName} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
            />
            <div className="text-center sm:text-left flex-1 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100">
                  Class {student.academics.class} - {student.academics.section}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full border border-gray-200">
                  Roll No: {student.academics.rollNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Navigation Tabs --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex overflow-x-auto hide-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "academic", label: "Academics", icon: BookOpen },
            { id: "medical", label: "Medical Info", icon: Activity },
            { id: "transport", label: "Transport", icon: Bus },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* --- Tab Content Area --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow label="First Name" value={student.firstName} icon={User} />
                <InfoRow label="Last Name" value={student.lastName} icon={User} />
                <InfoRow label="Date of Birth" value={student.dob} icon={Calendar} />
                <InfoRow label="Gender" value={student.gender} icon={User} />
                <InfoRow label="Blood Group" value={student.bloodGroup} icon={Droplet} />
                <InfoRow label="Student ID" value={student.id} icon={FileText} />
              </div>
            </div>
          )}

          {/* 2. ACADEMICS TAB */}
          {activeTab === "academic" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Academic Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow label="Current Class" value={`${student.academics.class} - ${student.academics.section}`} icon={BookOpen} />
                <InfoRow label="Roll Number" value={student.academics.rollNumber} icon={FileText} />
                <InfoRow label="Class Teacher" value={student.academics.classTeacher} icon={User} />
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-emerald-800 font-bold">Overall Attendance</h4>
                    <p className="text-sm text-emerald-600 mt-1">For current academic year</p>
                  </div>
                  <div className="text-3xl font-black text-emerald-600">{student.academics.attendance}</div>
                </div>
              </div>
            </div>
          )}

          {/* 3. MEDICAL TAB */}
          {activeTab === "medical" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Health & Medical</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Known Allergies" value={student.medical.allergies} icon={AlertCircle} />
                <InfoRow label="Current Medications" value={student.medical.medications} icon={Activity} />
                <InfoRow label="Blood Group" value={student.bloodGroup} icon={Droplet} />
                <InfoRow label="Emergency Contact" value={student.medical.emergencyContact} icon={Phone} />
              </div>
            </div>
          )}

          {/* 4. TRANSPORT TAB */}
          {activeTab === "transport" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Transport Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow label="Route Name" value={student.transport.route} icon={MapPin} />
                <InfoRow label="Pickup/Drop Stop" value={student.transport.stop} icon={MapPin} />
                <InfoRow label="Vehicle Number" value={student.transport.vehicleNo} icon={Bus} />
                <InfoRow label="Driver Name" value={student.transport.driverName} icon={User} />
                <InfoRow label="Driver Contact" value={student.transport.driverPhone} icon={Phone} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
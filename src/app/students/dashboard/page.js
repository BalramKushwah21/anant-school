"use client"

import React, { useState } from 'react';
import { 
  FiClock, 
  FiBookOpen, 
  FiAlertCircle, 
  FiCalendar, 
  FiAward, 
  FiChevronRight,
  FiBell
} from 'react-icons/fi';

const StudentDashboard = () => {
  // Mock Data: In production, this will be fetched from your API
  const [studentInfo] = useState({
    name: "Pooja Sharma",
    class: "Nursery - A",
    rollNo: "01",
    attendance: 88, // Percentage
  });

  const [todayClasses] = useState([
    { id: 1, subject: "Mathematics", time: "08:30 AM - 09:15 AM", teacher: "Mr. Gupta", room: "Room 102", status: "completed" },
    { id: 2, subject: "Science (Physics)", time: "09:15 AM - 10:00 AM", teacher: "Mrs. Verma", room: "Lab 3", status: "ongoing" },
    { id: 3, subject: "English Literature", time: "10:15 AM - 11:00 AM", teacher: "Ms. Davis", room: "Room 102", status: "upcoming" },
    { id: 4, subject: "Computer Science", time: "11:00 AM - 11:45 AM", teacher: "Mr. Singh", room: "Computer Lab", status: "upcoming" },
  ]);

  const [pendingTasks] = useState([
    { id: 1, type: "Homework", title: "Algebra Chapter 4 Ex.", due: "Today, 11:59 PM", priority: "High" },
    { id: 2, type: "Assignment", title: "Physics Lab Report", due: "Tomorrow", priority: "Medium" },
  ]);

  const [announcements] = useState([
    { id: 1, title: "Mid-Term Exam Schedule Published", date: "Oct 12", type: "Exam" },
    { id: 2, title: "Annual Sports Day Registrations", date: "Oct 10", type: "Event" },
  ]);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {studentInfo.name}! 👋</h1>
          <p className="text-blue-100 flex items-center space-x-4 text-sm md:text-base">
            <span>{studentInfo.class}</span>
            <span>•</span>
            <span>Roll No: {studentInfo.rollNo}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm text-blue-200 mb-1">Current Academic Session</p>
          <p className="font-semibold text-lg tracking-wide">2026 - 2027</p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Overall Attendance</p>
            <h3 className="text-3xl font-bold text-gray-800">{studentInfo.attendance}%</h3>
            <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-2 py-1 rounded-md">On Track</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50 text-blue-600">
             <FiCalendar className="text-2xl" />
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-gray-800">{pendingTasks.length}</h3>
            <p className="text-xs text-orange-600 mt-2 font-medium bg-orange-50 inline-block px-2 py-1 rounded-md">Requires Action</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center bg-orange-50 text-orange-500">
             <FiBookOpen className="text-2xl" />
          </div>
        </div>

        {/* Next Exam Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Next Examination</p>
            <h3 className="text-xl font-bold text-gray-800">Mid-Terms</h3>
            <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded-md">Starts in 14 Days</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-purple-400 flex items-center justify-center bg-purple-50 text-purple-500">
             <FiAward className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timetable (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiClock className="mr-2 text-blue-600" /> Today's Schedule
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                Full Timetable <FiChevronRight className="ml-1" />
              </button>
            </div>
            <div className="p-0">
              {todayClasses.map((cls, index) => (
                <div key={cls.id} className={`p-4 border-b border-gray-50 flex items-center justify-between transition-colors hover:bg-gray-50 ${cls.status === 'ongoing' ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-right w-32 hidden sm:block">
                      <p className="text-sm font-semibold text-gray-800">{cls.time.split('-')[0].trim()}</p>
                      <p className="text-xs text-gray-500">{cls.time.split('-')[1].trim()}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{cls.subject}</h4>
                      <p className="text-sm text-gray-500">{cls.teacher} • {cls.room}</p>
                    </div>
                  </div>
                  <div>
                    {cls.status === 'completed' && <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Completed</span>}
                    {cls.status === 'ongoing' && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold animate-pulse">Ongoing</span>}
                    {cls.status === 'upcoming' && <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">Upcoming</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Homework & Notices */}
        <div className="space-y-6">
          
          {/* Action Items / Homework */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiAlertCircle className="mr-2 text-orange-500" /> Action Items
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {pendingTasks.map(task => (
                <div key={task.id} className="p-3 border border-gray-100 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      {task.type}
                    </span>
                    <span className="text-xs font-medium text-gray-500">{task.due}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{task.title}</h4>
                </div>
              ))}
              <button className="w-full mt-2 py-2 text-sm text-center text-gray-500 hover:text-blue-600 font-medium transition-colors">
                View All Assignments
              </button>
            </div>
          </div>

          {/* Notice Board */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiBell className="mr-2 text-purple-500" /> Notice Board
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {announcements.map(notice => (
                <div key={notice.id} className="flex space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{notice.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{notice.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
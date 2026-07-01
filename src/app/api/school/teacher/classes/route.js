import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req) {
  try {
    // Academic profiles fetch kiye ja rahe hain jismein student aur attendance data shamil hai
    const profiles = await prisma.academicProfile.findMany({
      where: {
        // Aap yahan schoolId ya active academicYearId add kar sakte hain
      },
      include: {
        student: {
          select: {
            gender: true,
            attendances: {
              select: { status: true },
            },
          },
        },
      },
    });

    const classMap = {};

    profiles.forEach((profile) => {
      // Class aur Section ko combine karke unique key banayi gayi hai
      const classKey = `${profile.currentClass}-${profile.section || "A"}`;
      const className = `Class ${profile.currentClass} - ${profile.section || "A"}`;

      if (!classMap[classKey]) {
        classMap[classKey] = {
          className,
          totalStudents: 0,
          boysCount: 0,
          girlsCount: 0,
          avgAttendance: 0,
          classPerformance: "N/A", // Schema mein performance metrics abhi nahi hain
          subjectsCount: "N/A", 
          subjects: ["N/A"],
          upcomingExams: [], // Exam scheduling schema mein maujood nahi hai
          pendingAssignments: [], 
          weeklyAttendanceTrend: [
            { day: "Mon", rate: 0 },
            { day: "Tue", rate: 0 },
            { day: "Wed", rate: 0 },
            { day: "Thu", rate: 0 },
            { day: "Fri", rate: 0 },
          ],
          _attendanceStats: { total: 0, present: 0 },
        };
      }

      // Counts increment karna
      classMap[classKey].totalStudents++;
      
      if (profile.student.gender === "MALE") {
        classMap[classKey].boysCount++;
      } else if (profile.student.gender === "FEMALE") {
        classMap[classKey].girlsCount++;
      }

      // Attendance aggregation
      if (profile.student.attendances && profile.student.attendances.length > 0) {
        profile.student.attendances.forEach((att) => {
          classMap[classKey]._attendanceStats.total++;
          // Assuming "Present" ya "P" status flag hai
          if (att.status.toLowerCase().includes("present") || att.status === "P") {
            classMap[classKey]._attendanceStats.present++;
          }
        });
      }
    });

    // Average attendance percentage calculate karna
    Object.values(classMap).forEach((cls) => {
      if (cls._attendanceStats.total > 0) {
        cls.avgAttendance = Math.round(
          (cls._attendanceStats.present / cls._attendanceStats.total) * 100
        );
      } else {
        cls.avgAttendance = "N/A";
      }
      // Temporary object property hata dena
      delete cls._attendanceStats;
    });

    return NextResponse.json({ success: true, data: classMap });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
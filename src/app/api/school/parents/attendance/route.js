import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    // 1. Session Verification
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const userId = session.user.id;
    const schoolId = session.user.schoolId;

    // 2. Logged-in user ka username/email fetch karna
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, error: "User account not linked properly." }, { status: 404 });
    }

    const identifier = currentUser.username || "N/A";
    const userEmail = currentUser.email || "N/A";

    // 3. FETCH GLOBAL SCHOOL DAYS (Jaisa reference route.js me tha)
    const uniqueAttendanceDates = await prisma.attendance.groupBy({
      by: ["date"],
      where: { schoolId: schoolId },
    });
    const actualTotalSchoolDays = uniqueAttendanceDates.length;

    // 4. Find Family and their Students with Attendance History
    const family = await prisma.family.findFirst({
      where: {
        schoolId: schoolId,
        OR: [
          { fatherMobile: identifier },
          { motherMobile: identifier },
          { fatherEmail: userEmail },
          { motherEmail: userEmail },
        ]
      },
      include: {
        students: {
          where: { schoolId: schoolId },
          include: {
            academicProfiles: {
              orderBy: { createdAt: 'desc' },
              take: 1
            },
            attendances: {
              orderBy: { date: 'desc' }, // Latest attendance upar dikhane ke liye
            }
          }
        }
      }
    });

    if (!family || !family.students || family.students.length === 0) {
      return NextResponse.json({ success: false, error: "No student records found." }, { status: 404 });
    }

    // 5. Process Attendance Data for each child
    const studentsAttendanceData = family.students.map((student) => {
      const latestProfile = student.academicProfiles?.[0] || {};
      const classNameFull = latestProfile.currentClass ? `${latestProfile.currentClass} - ${latestProfile.section || ''}` : "N/A";

      // Count Present/Late days
      let presentDays = 0;
      if (student.attendances && student.attendances.length > 0) {
        presentDays = student.attendances.filter(a => 
          a.status.toUpperCase() === 'PRESENT' || a.status.toUpperCase() === 'LATE'
        ).length;
      }

      // Exact Logic for Attendance Summary
      const totalDays = actualTotalSchoolDays;
      const absentDays = totalDays > 0 ? (totalDays - presentDays) : 0;
      const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

      // Map recent history (last 10 records)
      const recentHistory = student.attendances.slice(0, 10).map(record => ({
        id: record.id,
        date: new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: record.status.toUpperCase(),
        remarks: record.remarks || ""
      }));

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName || ''}`.trim(),
        class: classNameFull,
        avatar: `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName || ''}&background=4F46E5&color=fff`,
        summary: {
          totalDays: totalDays,
          presentDays: presentDays,
          absentDays: absentDays,
          percentage: attendancePercentage
        },
        recentHistory: recentHistory
      };
    });

    return NextResponse.json({
      success: true,
      students: studentsAttendanceData
    }, { status: 200 });

  } catch (error) {
    console.error("Parent Attendance API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
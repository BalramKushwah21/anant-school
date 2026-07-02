import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    // 1. Session & Auth Verification
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const userId = session.user.id;
    const schoolId = session.user.schoolId;

    // 2. Fetch logged-in user details to match with Family table
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, error: "User account not linked properly." }, { status: 404 });
    }

    const identifier = currentUser.username || "N/A";
    const userEmail = currentUser.email || "N/A";

    // 3. FETCH GLOBAL SCHOOL DATA (For Actual Dues Logic)
    const schoolData = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        feeStructures: true, // Fetching master fee settings
      },
    });
    const feeStructuresList = schoolData?.feeStructures || [];

    // 4. FETCH GLOBAL SCHOOL DAYS (For Actual Attendance Logic)
    const uniqueAttendanceDates = await prisma.attendance.groupBy({
      by: ["date"],
      where: { schoolId: schoolId },
    });
    const actualTotalSchoolDays = uniqueAttendanceDates.length;
    // 5. Find Family and their linked Students
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
            attendances: true, 
            feeRecords: true,   
          }
        }
      }
    });

    if (!family || !family.students || family.students.length === 0) {
      return NextResponse.json({ success: false, error: "No student records found for this parent account." }, { status: 404 });
    }

    let totalFamilyDues = 0;

    // 6. Map and process data for each child EXACTLY like the reference logic
    const formattedChildren = family.students.map((student) => {
      
      // --- ACTUAL ATTENDANCE CALCULATION ---
      let presentDays = 0;
      if (student.attendances && student.attendances.length > 0) {
        presentDays = student.attendances.filter(a => a.status === 'present' || a.status === 'late').length;
      }
      const attendancePercentage = actualTotalSchoolDays > 0 
        ? Math.round((presentDays / actualTotalSchoolDays) * 100) 
        : 100;
      // --- ACTUAL DUE CALCULATION ---
      // Get current class
      const latestProfile = student.academicProfiles?.[0] || {};
      const studentClass = latestProfile.currentClass || "N/A";
      const classNameFull = latestProfile.currentClass ? `${latestProfile.currentClass} - ${latestProfile.section || ''}` : "N/A";

      // Match class with school fee structure
      const classFeeRecord = feeStructuresList.find((fee) => fee.className === studentClass);
      const totalFee = classFeeRecord ? Number(classFeeRecord.totalFee) : 0;
      
      // Calculate paid fee from feeRecords
      const paidFee = Number(student.feeRecords?.[0]?.admissionFeePaid || 0);
      
      // Calculate Pending Due
      const rawDue = totalFee - paidFee;
      const studentPendingFee = totalFee > 0 ? (rawDue > 0 ? rawDue : 0) : 0;
      
      totalFamilyDues += studentPendingFee;

      return {
        id: student.id,
        rollNo: student.rollNumber || "N/A",
        name: `${student.firstName} ${student.lastName || ''}`.trim(),
        class: classNameFull,
        avatar: `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName || ''}&background=4F46E5&color=fff`,
        attendance: attendancePercentage,
        pendingFees: `₹ ${studentPendingFee.toLocaleString('en-IN')}`,
        homework: 0, 
        nextExam: "View Profile for Marks"
      };
    });

    // 7. Assemble Parent Info
    const parentInfo = {
      name: family.fatherEmail === userEmail || family.fatherMobile === identifier ? family.fatherName : family.motherName,
      relation: family.fatherEmail === userEmail || family.fatherMobile === identifier ? "Father" : "Mother",
      familyBalance: `₹ ${totalFamilyDues.toLocaleString('en-IN')}`
    };

    // Announcements
    const announcements = [
      { id: 1, title: "Parent-Teacher Meeting Scheduled", date: "Coming Soon", type: "Event" },
      { id: 2, title: "Official School Uniform Guidelines Notice", date: "Recent", type: "Notice" },
    ];

    return NextResponse.json({
      success: true,
      parentInfo,
      children: formattedChildren,
      announcements
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard Dynamic Compilation Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
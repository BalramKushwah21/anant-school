import { NextResponse } from 'next/server';


import { prisma } from '@/lib/prisma'; 



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); 

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Prisma DB Query
    const family = await prisma.family.findFirst({
      where: {
        OR: [
          { fatherEmail: email },
          { motherEmail: email }
        ]
      },
      include: {
        students: {
          include: {
            academicProfiles: {
              orderBy: { createdAt: 'desc' },
              take: 1
            },
            attendances: true,
            feeRecords: true
          }
        }
      }
    });
    
    if (!family) {
      return NextResponse.json({ error: "No student records found for this parent email." }, { status: 404 });
    }

    let totalFamilyDues = 0;

    const formattedChildren = family.students.map((student) => {
      const totalDays = student.attendances.length;
      const presentDays = student.attendances.filter(a => a.status === 'PRESENT').length;
      const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

      const latestProfile = student.academicProfiles[0];
      const className = latestProfile ? `${latestProfile.currentClass} - ${latestProfile.section || ''}` : "N/A";

      const studentPendingFee = 5500; 
      totalFamilyDues += studentPendingFee;

      return {
        id: student.rollNumber || student.id.substring(0, 8),
        name: `${student.firstName} ${student.lastName || ''}`.trim(),
        class: className,
        avatar: `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName || ''}&background=4F46E5&color=fff`,
        attendance: attendancePercentage,
        nextExam: "Mid-Terms (Oct 15)", 
        pendingFees: `₹ ${studentPendingFee.toLocaleString('en-IN')}`,
        homework: Math.floor(Math.random() * 3) 
      };
    });

    const parentInfo = {
      name: family.fatherEmail === email ? family.fatherName : family.motherName, 
      relation: family.fatherEmail === email ? "Father" : "Mother",
      familyBalance: `₹ ${totalFamilyDues.toLocaleString('en-IN')}`
    };

    const announcements = [
      { id: 1, title: "Parent-Teacher Meeting Scheduled", date: "Oct 20", type: "Event" },
      { id: 2, title: "Winter Uniform Guidelines", date: "Oct 12", type: "Notice" },
    ];

    return NextResponse.json({
      parentInfo,
      children: formattedChildren,
      announcements
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
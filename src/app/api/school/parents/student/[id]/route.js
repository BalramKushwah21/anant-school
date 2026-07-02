import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const studentId = params.id;

    // 1. Secure Session Verification
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access or invalid session." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const schoolId = session.user.schoolId;

    // 2. Fetch logged-in user's username AND email
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "User account not linked properly." },
        { status: 404 }
      );
    }

    const identifier = currentUser.username || "N/A";
    const userEmail = currentUser.email || "N/A";

    // 3. SMART SEARCH: Find Family by matching Mobile OR Email
    const family = await prisma.family.findFirst({
      where: {
        schoolId: schoolId,
        OR: [
          { fatherMobile: identifier },
          { motherMobile: identifier },
          { fatherEmail: userEmail },
          { motherEmail: userEmail },
          { fatherEmail: identifier }, // In case username is saved as email
          { motherEmail: identifier }
        ]
      }
    });

    if (!family) {
      return NextResponse.json(
        { success: false, error: "Parent family record not found for this user." },
        { status: 404 }
      );
    }

    // 4. Fetch the specific student under this verified family
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        familyId: family.id,
        schoolId: schoolId
      },
      include: {
        academicProfiles: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        attendances: true,
        medicalProfile: true,
        transportProfile: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student record not found or access denied." },
        { status: 404 }
      );
    }

    // Attendance percentage calculation
    const totalDays = student.attendances ? student.attendances.length : 0;
    const presentDays = student.attendances ? student.attendances.filter(a => a.status === 'PRESENT').length : 0;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    // Safely mapping relational objects
    const currentAcademic = student.academicProfiles?.[0] || {};
    const medical = student.medicalProfile || {};
    const transport = student.transportProfile || {};

    const formattedDob = student.dob 
      ? new Date(student.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) 
      : "N/A";

    // Structuring exact layout keys for frontend binding
    const formattedData = {
      id: student.id,
      rollNumber: student.rollNumber || "N/A",
      firstName: student.firstName,
      lastName: student.lastName || "",
      dob: formattedDob,
      gender: student.gender || "N/A",
      bloodGroup: student.bloodGroup || "N/A",
      avatar: `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName || ""}&background=4F46E5&color=fff&size=150`,
      academics: {
        class: currentAcademic.currentClass || "N/A",
        section: currentAcademic.section || "N/A",
        rollNumber: student.rollNumber || "N/A",
        classTeacher: currentAcademic.classTeacher || "N/A",
        attendance: `${attendancePercentage}%`,
      },
      medical: {
        allergies: medical.allergies || "None",
        medications: medical.medicalConditions || "None",
        emergencyContact: medical.emergencyContactNumber || "N/A",
      },
      transport: {
        route: transport.route || "N/A",
        stop: transport.pickupPoint || "N/A",
        vehicleNo: transport.vehicleNo || "N/A",
        driverName: transport.driverName || "N/A",
        driverPhone: transport.driverPhone || "N/A",
      }
    };

    return NextResponse.json({ success: true, student: formattedData }, { status: 200 });

  } catch (error) {
    console.error("Student Profile Backend Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
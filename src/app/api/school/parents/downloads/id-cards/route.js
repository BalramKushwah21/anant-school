import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    // 1. Session and Auth Security Check
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const userId = session.user.id;
    const schoolId = session.user.schoolId;

    // 2. Fetch logged-in user credentials
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, error: "User profile not found." }, { status: 404 });
    }

    const identifier = currentUser.username || "N/A";
    const userEmail = currentUser.email || "N/A";

    // 3. Find parent's Family Record using secure OR lookup parameters
    const family = await prisma.family.findFirst({
      where: {
        schoolId: schoolId,
        OR: [
          { fatherMobile: identifier },
          { motherMobile: identifier },
          { fatherEmail: userEmail },
          { motherEmail: userEmail }
        ]
      },
      include: {
        school: {
          select: { schoolName: true }
        },
        students: {
          where: { schoolId: schoolId },
          include: {
            academicProfiles: {
              orderBy: { createdAt: 'desc' },
              take: 1
            },
            addresses: {
              take: 1
            }
          }
        }
      }
    });

    if (!family || !family.students || family.students.length === 0) {
      return NextResponse.json({ success: false, error: "No registered children profiles found for this account." }, { status: 404 });
    }

    const officialSchoolName = family.school?.schoolName || "Greenwood Int. School";

    // 4. Map student items exactly to match your premium ID template schema keys
    const formattedCards = family.students.map((student) => {
      const currentAcademic = student.academicProfiles?.[0] || {};
      const primaryAddress = student.addresses?.[0] || {};

      const combinedAddress = primaryAddress.city
        ? `${primaryAddress.city}, ${primaryAddress.district || ""}`.trim()
        : "Not Provided";

      const formattedDob = student.dob
        ? new Date(student.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : "N/A";

      return {
        id: student.id,
        schoolName: officialSchoolName,
        rollNumber: student.rollNumber || "N/A",
        name: `${student.firstName} ${student.lastName || ""}`.trim(),
        class: currentAcademic.currentClass || "N/A",
        section: currentAcademic.section || "A",
        phone: family.fatherMobile || family.motherMobile || "N/A",
        fatherName: family.fatherName || "N/A",
        bloodGroup: student.bloodGroup || "N/A",
        dob: formattedDob,
        address: combinedAddress,
        avatar: `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName || ""}&background=0D9488&color=fff&size=150`
      };
    });

    return NextResponse.json({ success: true, idCards: formattedCards }, { status: 200 });

  } catch (error) {
    console.error("ID Card Parent Route Critical Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
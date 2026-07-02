import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // 1. Authenticate and extract multi-tenant School ID
    const session = await getServerSession(authOptions);
    const schoolId = session?.user?.schoolId;

    if (!session || !schoolId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Session or School ID missing." },
        { status: 401 }
      );
    }

    // 2. Fetch Query Parameters (Class & Section filters)
    const { searchParams } = new URL(request.url);
    const targetClass = searchParams.get("class");
    const targetSection = searchParams.get("section");

    if (!targetClass || !targetSection) {
      return NextResponse.json(
        { success: false, message: "Class and section parameters are required." },
        { status: 400 }
      );
    }

    // 3. Fetch school metadata for the official banner title
    const schoolData = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { schoolName: true }
    });
    const officialSchoolName = schoolData?.schoolName || "Greenwood Int. School";

    // 4. Query students with all unified relational payloads needed for the card layout
    const studentsRaw = await prisma.student.findMany({
      where: {
        schoolId: schoolId,
        academicProfiles: {
          some: {
            currentClass: targetClass,
            section: targetSection,
          }
        }
      },
      include: {
        academicProfiles: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        family: true,
        addresses: {
          take: 1
        }
      }
    });

    // 5. Clean Mapping Pipeline to mirror Parents Dashboard structure perfectly
    const formattedStudents = studentsRaw.map((student) => {
      const academic = student.academicProfiles?.[0] || {};
      const family = student.family || {};
      const address = student.addresses?.[0] || {};

      const formattedDob = student.dob 
        ? new Date(student.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : "N/A";

      const combinedAddressStr = address.city
        ? `${address.city}, ${address.district || ''}`.trim()
        : "N/A";

      return {
        id: student.id, // Absolute unique db id used for secure scan actions
        rollNumber: student.rollNumber || "N/A",
        name: `${student.firstName} ${student.lastName || ''}`.trim(),
        class: targetClass,
        section: targetSection,
        dob: formattedDob,
        gender: student.gender || "N/A",
        bloodGroup: student.bloodGroup || "N/A",
        schoolName: officialSchoolName,
        fatherName: family.fatherName || "Not Provided",
        phone: family.fatherMobile || family.motherMobile || "Not Provided",
        address: combinedAddressStr,
        avatar: `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName || ''}&background=4F46E5&color=fff&size=150`
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedStudents.length,
      data: formattedStudents
    }, { status: 200 });

  } catch (error) {
    console.error("Admin ID Card Batch Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
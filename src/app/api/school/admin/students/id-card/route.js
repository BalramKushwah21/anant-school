import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const className = searchParams.get('class');
  const rollNo = searchParams.get('rollNo');

  try {
    // Build dynamic where clause based on user input
    let whereClause = {};
    
    if (rollNo) {
      whereClause.rollNumber = rollNo;
    }
    
    if (className) {
      whereClause.academicProfile = {
        currentClass: className
      };
    }

    // Fetch students with all necessary relations for the ID Card
    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        academicProfile: true,
        documents: true, // For profile picture
        school: true     // For school name and logo
      }
    });

    if (students.length === 0) {
      return NextResponse.json({ success: false, message: "No students found." }, { status: 404 });
    }

    // Map data to a clean format for the frontend
    const formattedData = students.map(st => ({
      id: st.id,
      name: `${st.firstName} ${st.lastName}`,
      rollNo: st.rollNumber,
      dob: new Date(st.dateOfBirth).toLocaleDateString('en-IN'),
      bloodGroup: st.bloodGroup || 'N/A',
      className: st.academicProfile ? `${st.academicProfile.currentClass} - ${st.academicProfile.section || ''}` : 'N/A',
      photoUrl: st.documents?.studentPhotoUrl || null,
      schoolName: st.school?.schoolName || 'Excel Academy',
      schoolPhone: st.school?.phone || '',
      validUntil: '2027-03-31' // Can be dynamic based on Academic Session
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching ID card data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
  }
}
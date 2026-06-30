import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Update this path if needed

// ==========================================
// Helper: Get Active Academic Year
// ==========================================
async function getActiveAcademicYear(schoolId) {
	return await prisma.academicYear.findFirst({
		where: { schoolId: schoolId, isActive: true },
	});
}

// ==========================================
// GET Method: Fetch Master Registry Data
// ==========================================
export async function GET(request) {
    try {
        // 1. Authenticate Session
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.schoolId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }
        const { schoolId } = session.user;

        // 2. Fetch Active Academic Year
        const activeYear = await getActiveAcademicYear(schoolId);
        if (!activeYear) {
            return NextResponse.json({ error: "No active academic year found for this school." }, { status: 400 });
        }

        // ==========================================
        // STEP A: Fetch School's Fee Structures (Using findUnique)
        // ==========================================
        const schoolData = await prisma.school.findUnique({
            where: { id: schoolId },
            include: {
                feeStructures: true, // Fetch all classes fees
            },
        });

        // Safe check
        const feeStructuresList = schoolData?.feeStructures || [];

        // ==========================================
        // STEP B: Fetch Students with all related profiles
        // ==========================================
        const students = await prisma.student.findMany({
            where: { schoolId: schoolId },
            include: {
                family: true,
                addresses: true,
                transportProfile: true,
                academicProfiles: {
                    where: { academicYearId: activeYear.id },
                },
                feeRecords: {
                    where: { academicYearId: activeYear.id },
                },
            },
            orderBy: { firstName: "asc" },
        });

        // ==========================================
        // STEP C: Format Data & Calculate DYNAMIC Fees
        // ==========================================
        const formattedData = students.map((student) => {
            const academic = student.academicProfiles[0] || {};
            const family = student.family || {};
            const address = student.addresses[0] || {};
            const transport = student.transportProfile || {};
            const fee = student.feeRecords[0] || {};

            const studentClass = academic.currentClass || "N/A";

            // 🌟 DYNAMIC FEE CALCULATION 🌟
            // Database se aayi feeStructuresList mein se is student ki class wali fees dhoondho
            const classFeeStructure = feeStructuresList.find(
                (fs) => fs.className === studentClass // 'className' aapke schema ke column par depend karega
            );

            // Agar DB me us class ki fees set hai toh wo lo, warna default 0 ya fallback set karo
            const totalFee = classFeeStructure ? Number(classFeeStructure.totalFee) :"N/A";

            const paidAmount =
                Number(fee.admissionFeePaid || 0) +
                Number(fee.transportFeePaid || 0);

            const dueAmount = totalFee - paidAmount;

            return {
                id: student.id,
                rollNo: student.rollNumber || "N/A",
                name: `${student.firstName} ${student.lastName || ""}`.trim(),
                parent: family.fatherName || family.motherName || "N/A",
                contact: family.fatherMobile || family.motherMobile || "N/A",
                address: `${address.street || ""}, ${address.city || ""}`.trim(),
                class: studentClass,
                section: academic.section || "N/A",
                route: transport.route || "Not Assigned",
                village: address.city || "N/A",
                totalFee: totalFee, // Yahan ab dynamic fee lag gayi!
                paidAmount: paidAmount,
                dueAmount: dueAmount > 0 ? dueAmount : 0,
            };
        });

        return NextResponse.json(
            { success: true, data: formattedData },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET Registry Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
// ==========================================
// PUT/POST Method: Update Fee & Transport
// ==========================================
export async function POST(request) {
	try {
		// 1. Authenticate Session
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}
		const { schoolId } = session.user;

		// 2. Parse Data from Frontend Modal
		const body = await request.json();
        
		const { id: studentId, paidAmount, route } = body;

		if (!studentId) {
			return NextResponse.json(
				{ success: false, error: "Student ID is required" },
				{ status: 400 },
			);
		}

		const activeYear = await getActiveAcademicYear(schoolId);

		// 3. Update DB in a Transaction to ensure consistency
		await prisma.$transaction(async (tx) => {
			// A. Update Fee Record (Storing input paidAmount in admissionFeePaid as primary ledger)
			if (paidAmount !== undefined) {
				const existingFee = await tx.feeRecord.findFirst({
					where: { studentId, academicYearId: activeYear.id },
				});

				if (existingFee) {

					await tx.feeRecord.update({
						where: { id: existingFee.id },
						data: { admissionFeePaid: Number(paidAmount) },
					});
				}
			}

			// B. Update Transport Route
			if (route !== undefined) {
				const existingTransport = await tx.transportProfile.findUnique({
					where: { studentId },
				});

				if (existingTransport) {
					await tx.transportProfile.update({
						where: { id: existingTransport.id },
						data: { route: route },
					});
				}
			}
		});

		return NextResponse.json(
			{
				success: true,
				message: "Student profile & fees updated successfully!",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("POST Update Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

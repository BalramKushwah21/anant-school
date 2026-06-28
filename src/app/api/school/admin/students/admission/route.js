import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to map Frontend Fee Category strings to Prisma Enums
const mapFeeCategory = (categoryStr) => {
	switch (categoryStr) {
		case "Staff Discount":
			return "STAFF_DISCOUNT";
		case "Sibling Discount":
			return "SIBLING_DISCOUNT";
		case "Merit Scholarship":
			return "MERIT";
		case "EWS":
			return "EWS";
		default:
			return "GENERAL";
	}
};

export async function POST(request) {
	try {

		function getAcademicSession() {
			const today = new Date();

			const year = today.getFullYear();
			const month = today.getMonth(); // January = 0

			if (month >= 3) {
				// April ya uske baad
				return `${year}-${year + 1}`;
			} else {
				// January se March
				return `${year - 1}-${year}`;
			}
		}

		console.log(getAcademicSession());


		// 1. SECURITY: Check if user is logged in
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized access. Please login." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		if (!schoolId) {
			return NextResponse.json(
				{ error: "School account not linked to user." },
				{ status: 403 },
			);
		}

		// 2. FETCH ACTIVE ACADEMIC YEAR (New Logic - Best Practice)
		// Admission hamesha current active year mein hona chahiye
		const activeYear = await prisma.academicYear.findFirst({
			where: { schoolId: schoolId, isActive: true },
		});

		if (!activeYear) {
			return NextResponse.json(
				{
					error: "No active Academic Year found. Please setup an active session in School Settings first.",
				},
				{ status: 400 },
			);
		}

		// 3. READ FORM DATA
		const data = await request.json();

		// 4. BASIC VALIDATION
		if (
			!data.firstName ||
			!data.lastName ||
			!data.admissionDate ||
			!data.dob ||
			!data.classApplyingFor
		) {
			return NextResponse.json(
				{ error: "All mandatory fields (*) are required." },
				{ status: 400 },
			);
		}

		// 4.5 CHECK DUPLICATE AADHAR (Yeh naya block add karein)
		if (data.aadhar) {
			const existingStudent = await prisma.student.findUnique({
				where: { nationalIdNumber: data.aadhar },
			});

			if (existingStudent) {
				return NextResponse.json(
					{
						error: "A student with this Aadhar/National ID already exists in the system.",
					},
					{ status: 400 },
				);
			}
		}

		// 5. SAVE TO DATABASE (Nested Writes Fixed)
		const newStudent = await prisma.student.create({
			data: {
				school: { connect: { id: schoolId } },

				// Student Core
				firstName: data.firstName,
				lastName: data.lastName,
				admissionDate: new Date(data.admissionDate),
				dateOfBirth: new Date(data.dob),
				gender: data.gender ? data.gender.toUpperCase() : "OTHER",
				bloodGroup: data.bloodGroup || null,
				religion: data.religion || null,
				category: data.category
					? data.category.toUpperCase()
					: "GENERAL",
				nationality: data.nationality || "Indian",
				isStaffChild: data.isStaffChild === "Yes",
				identificationMark: data.identificationMark || null,
				nationalIdNumber: data.aadhar || null,
				abcId: data.abcId || null,
				panNumber: data.panNumber || null,

				// Family & Address Profile
				family: {
					create: {
						school: { connect: { id: schoolId } },
						parentsMaritalStatus: data.parentsMaritalStatus
							? data.parentsMaritalStatus.toUpperCase()
							: "MARRIED",
						legalCustodyHolder: data.legalCustodyHolder
							? data.legalCustodyHolder.toUpperCase()
							: "BOTH",

						fatherName: data.fatherName,
						fatherMobile: data.fatherMobile,
						fatherOccupation: data.fatherOccupation || null,
						fatherIncome: data.fatherIncome || null,
						fatherEmail: data.fatherEmail || null,

						motherName: data.motherName,
						motherMobile: data.motherMobile,
						motherOccupation: data.motherOccupation || null,
						motherEmail: data.motherEmail || null,

						siblingStudyingHere: data.siblingStudyingHere === "Yes",
						siblingDetails: data.siblingDetails || null,

						address: {
							create: {
								houseNo: data.houseNo || null,
								street: data.street,
								city: data.city,
								district: data.district,
								state: data.state,
								pincode: data.pincode,
							},
						},
					},
				},

				// Academic Profile (FIXED: Connected using Active Academic Year ID)
				academicProfiles: {
					create: {
						school: { connect: { id: schoolId } },
						academicYear: { connect: { id: activeYear.id } }, // FIX APPLIED HERE
						academicSession: getAcademicSession() || "N/A",
						

						currentClass: data.classApplyingFor,
						section: data.section || null,
						previousSchool: data.previousSchool || null,
						previousClass: data.previousClass || null,
						previousUdiseCode: data.previousUdiseCode || null,
						previousSchoolMedium:
							data.previousMediumOfInstruction || null,
						tcNumber: data.tcNumber || null,
						boardRegistrationNo:
							data.boardRegistrationNumber || null,
					},
				},

				// Medical Profile
				medicalProfile: {
					create: {
						school: { connect: { id: schoolId } },
						emergencyContactName: data.emergencyContact,
						emergencyContactNumber: data.emergencyMobile,
						relationWithStudent: data.emergencyRelation,
						familyDoctorName: data.familyDoctorName || null,
						familyDoctorContactNumber:
							data.familyDoctorMobile || null,
						preferredHospital: data.preferredHospital || null,
						medicalConditions: data.medicalConditions || null,
						allergies: data.allergies || null,
					},
				},

				// Financial/Fee Profile (FIXED: pluralized to feeRecords & added academicYear connect)
				feeRecords: {
					create: {
						school: { connect: { id: schoolId } },
						academicYear: { connect: { id: activeYear.id } }, // Required by schema

						feeCategory: mapFeeCategory(data.feeCategory),
						scholarship: data.scholarship === "Yes",
						concessionDetails: data.concessionDetails || null,

						admissionFeePaid:
							parseFloat(data.admissionFeePaid) || 0,
						transportFeePaid:
							parseFloat(data.transportFeePaid) || 0,
						securityDepositPaid:
							parseFloat(data.securityDepositPaid) || 0,

						tuitionFeeCycle: data.tuitionFeeCycle
							? data.tuitionFeeCycle.toUpperCase()
							: "QUARTERLY",
						paymentMode: data.paymentMode
							? data.paymentMode.toUpperCase().replace(" ", "_")
							: "CASH",

						bankName: data.bankName || null,
						accountNumber: data.accountNumber || null,
						ifscCode: data.ifscCode || null,
						branchNameAndCode: data.branchNameAndCode || null,
					},
				},
			},
		});

		return NextResponse.json(
			{
				message: "Student admitted successfully",
				data: newStudent,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Admission Backend Error:", error);
		return NextResponse.json(
			{
				error:
					error.message ||
					"Internal Server Error. Please try again later.",
			},
			{ status: 500 },
		);
	}
}

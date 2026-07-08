import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { u } from "framer-motion/client";

export async function POST(request) {
	try {
		// 1. Security Check
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access. Please log in." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;

		// 2. Parse Form Data
		const formData = await request.formData();
		const getStr = (key) => {
			const val = formData.get(key);
			return val && val !== "null" ? val.toString().trim() : "";
		};

		const firstName = getStr("firstName");
		const middleName = getStr("middleName");
		const lastName = getStr("lastName");
		const aadhar = getStr("aadhar");
		const dob = getStr("dob");

		const studentUsername = getStr("studentUsername");
		const studentPassword = getStr("studentPassword");
		const fatherUsername = getStr("fatherUsername");
		const fatherPassword = getStr("fatherPassword");

		if (
			!firstName ||
			!lastName ||
			!aadhar ||
			!dob ||
			!studentUsername ||
			!studentPassword
		) {
			return NextResponse.json(
				{ error: "Missing required fields." },
				{ status: 400 },
			);
		}

		// 3. Document Handling
		const fileFields = [
			"studentPhoto",
			"fatherAadhar",
			"motherAadhar",
			"studentAadhar",
			"studentBirthCertificate",
			"studentCasteCertificate",
			"domicileCertificate",
			"familyId",
			"studentTc",
			"incomeCertificate",
			"bplCertificate",
			"previousMarksheet",
		];

		const uploadedDocuments = {};
		for (const field of fileFields) {
			const file = formData.get(field);
			if (file && typeof file === "object" && file.size > 0) {
				// 1. Convert File to Buffer
				const bytes = await file.arrayBuffer();
				const buffer = Buffer.from(bytes);

				// 2. Define VPS Path (Adjacent to your Next.js project)
				const baseUploadDir = path.join(
					process.cwd(),
					"..",
					"school-media",
				);
				const moduleName = "studentDocuments"; // Assuming module is 'students' for student document
				const firstName = formData.get("firstName");
				const aadharNumber = formData.get("aadhar");


				const type = `${firstName}${aadharNumber.slice(-4)}`;

				const targetDir = path.join(
					baseUploadDir,
					schoolId,
					moduleName,
					type,
				);

				// 3. Auto-create folder securely
				await fs.mkdir(targetDir, { recursive: true });

				// 4. Clean filename aur Directory me save karein (FILE DIR ME SAVE)
				const extension = file.name.split(".").pop();
				const fileName = `document-${field}.${extension}`;
				const filePath = path.join(targetDir, fileName);

				await fs.writeFile(filePath, buffer);

				// 5. Generate secure serve URL
				const fileUrl = `/api/school/media/${schoolId}/${moduleName}/${type}/${fileName}`;

				uploadedDocuments[field] = fileUrl;
			}
		}


		// 4. Passwords
		const saltRounds = 10;
		const hashedStudentPw = await bcrypt.hash(studentPassword, saltRounds);
		const hashedFatherPw = fatherPassword
			? await bcrypt.hash(fatherPassword, saltRounds)
			: null;

		// 5. ATOMIC TRANSACTION
		const newAdmission = await prisma.$transaction(
			async (tx) => {
				// ✨ FIX: Properly fetching and assigning the active year ID
				const activeYear = await tx.academicYear.findFirst({
					where: { schoolId: schoolId },
				});

				// Agar academic year nahi mila, toh transaction yahi rok dein
				if (!activeYear) {
					throw new Error("ACADEMIC_YEAR_MISSING");
				}
				const activeYearId = activeYear.id; // Corrected Line

				// STEP 1: Father User
				let fatherUserId = null;
				if (fatherUsername && hashedFatherPw) {
					const father = await tx.user.create({
						data: {
							school: { connect: { id: schoolId } },
							username: fatherUsername,
							password: hashedFatherPw,
							userRole: "PARENT",
							name: getStr("fatherName"),
							email: getStr("fatherEmail"),
							isActive: true,
						},
					});
					fatherUserId = father.id;
				}

				// STEP 2: Student User
				const studentUser = await tx.user.create({
					data: {
						school: { connect: { id: schoolId } },
						username: studentUsername,
						password: hashedStudentPw,
						userRole: "STUDENT",
						name: `${firstName} ${middleName ? middleName + " " : ""}${lastName}`,
						email: getStr("studentEmail"),
						isActive: true,
					},
				});

				// STEP 3: Family Record
				const familyRecord = await tx.family.create({
					data: {
						school: { connect: { id: schoolId } },
						fatherName: getStr("fatherName"),
						motherName: getStr("motherName"),
						fatherMobile: getStr("fatherMobile"),
						fatherDOB: getStr("fatherDob"),
						motherDOB: getStr("motherDob"),
						parentsMaritalStatus: getStr("parentsMaritalStatus")
							? getStr("parentsMaritalStatus")
									.toUpperCase()
									.replace(" ", "_")
							: undefined,
						legalCustodyHolder: getStr("legalCustodyHolder")
							? getStr("legalCustodyHolder")
									.toUpperCase()
									.replace(" ", "_")
							: undefined,
						fatherOccupation: getStr("fatherOccupation"),
						fatherIncome: getStr("fatherIncome"),
						fatherEmail: getStr("fatherEmail"),
						motherMobile: getStr("motherMobile"),
						motherOccupation: getStr("motherOccupation"),
						motherEmail: getStr("motherEmail"),
						siblingStudyingHere:
							getStr("siblingStudyingHere") === "Yes",
						siblingDetails: getStr("siblingDetails"),
					},
				});

				// STEP 4: Complete Student Profile
				const studentProfile = await tx.student.create({
					include: {
						documents: true,
					},
					data: {
						// Core Relations
						school: { connect: { id: schoolId } },
						family: { connect: { id: familyRecord.id } },
						user: { connect: { id: studentUser.id } },

						// Personal Info
						firstName,
						middleName,
						lastName,
						dateOfBirth: new Date(dob),
						gender: getStr("gender").toUpperCase(),
						bloodGroup: getStr("bloodGroup"),
						religion: getStr("religion"),
						category: getStr("category").toUpperCase(),
						nationality: getStr("nationality") || "Indian",
						isStaffChild: getStr("isStaffChild") === "Yes",
						identificationMark: getStr("identificationMark"),
						aadharNumber: getStr("aadhar"),
						abcId: getStr("abcId"),
						samagraId: getStr("samagraId"),
						panNumber: getStr("panNumber"),
						admissionDate: getStr("admissionDate")
							? new Date(getStr("admissionDate"))
							: new Date(),

						documents: {
							create: {
								school: { connect: { id: schoolId } },

								studentPhoto:
									uploadedDocuments.studentPhoto || null,
								fatherAadhar:
									uploadedDocuments.fatherAadhar || null,
								motherAadhar:
									uploadedDocuments.motherAadhar || null,
								birthCertificate:
									uploadedDocuments.studentBirthCertificate ||
									null,
								studentAadhar:
									uploadedDocuments.studentAadhar || null,

								previousMarksheet:
									uploadedDocuments.previousMarksheet || null,
								casteCertificate:
									uploadedDocuments.casteCertificate || null,
								domicileCertificate:
									uploadedDocuments.domicileCertificate ||
									null,
								transferCertificate:
									uploadedDocuments.transferCertificate ||
									null,

								familyId: uploadedDocuments.familyId || null,
								incomeCertificate:
									uploadedDocuments.incomeCertificate || null,
								bplCertificate:
									uploadedDocuments.bplCertificate || null,

								// Uploaded documents stored here
							},
						},

						// Academic Profile
						academicProfiles: {
							create: {
								school: { connect: { id: schoolId } },
								academicYear: {
									connect: { id: activeYearId }, // Now uses real CUID
								},
								currentClass: getStr("classApplyingFor"),
								section: getStr("section"),
								previousSchool: getStr("previousSchool"),
								previousClass: getStr("previousClass"),
								tcNumber: getStr("tcNumber"),
								previousUdiseCode: getStr("previousUdiseCode"),
								previousSchoolMedium: getStr(
									"previousMediumOfInstruction",
								),
								boardRegistrationNo: getStr(
									"boardRegistrationNumber",
								),
							},
						},

						// Addresses
						addresses: {
							create: {
								family: { connect: { id: familyRecord.id } },
								houseNo: getStr("houseNo"),
								street: getStr("street"),
								city: getStr("city"),
								district: getStr("district"),
								state: getStr("state"),
								pincode: getStr("pincode"),
							},
						},

						// Medical Profile
						medicalProfile: {
							create: {
								school: { connect: { id: schoolId } },
								emergencyContactName:
									getStr("emergencyContact"),
								emergencyContactNumber:
									getStr("emergencyMobile"),
								relationWithStudent:
									getStr("emergencyRelation"),
								medicalConditions: getStr("medicalConditions"),
								allergies: getStr("allergies"),
								familyDoctorName: getStr("familyDoctorName"),
								familyDoctorContactNumber:
									getStr("familyDoctorMobile"),
								preferredHospital: getStr("preferredHospital"),
							},
						},

						// Fee Records
						feeRecords: {
							create: {
								academicYear: {
									connect: { id: activeYearId }, // Now uses real CUID
								},
								school: { connect: { id: schoolId } },
								feeCategory: getStr("feeCategory")
									? getStr("feeCategory")
											.toUpperCase()
											.replace(" ", "_")
									: "GENERAL",
								scholarship: getStr("scholarship") === "Yes",
								concessionDetails: getStr("concessionDetails"),
								admissionFeePaid:
									parseFloat(getStr("admissionFeePaid")) || 0,
								transportFeePaid:
									parseFloat(getStr("transportFeePaid")) || 0,
								securityDepositPaid:
									parseFloat(getStr("securityDepositPaid")) ||
									0,
								paymentMode: getStr("paymentMode")
									? getStr("paymentMode")
											.toUpperCase()
											.replace(" ", "_")
									: "CASH",
								bankName: getStr("bankName"),
								accountNumber: getStr("accountNumber"),
								ifscCode: getStr("ifscCode"),
								branchNameAndCode: getStr("branchNameAndCode"),
							},
						},
					},
				});

				return studentProfile;
			},
			{
				maxWait: 5000,
				timeout: 30000,
			},
		);

		return NextResponse.json(
			{
				success: true,
				message: "Student admission completed successfully.",
				data: newAdmission,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Admission API Error:", error);

		// ✨ FIX: Missing Academic Year handler added
		if (error.message === "ACADEMIC_YEAR_MISSING") {
			return NextResponse.json(
				{
					error: "No active Academic Year found for this school. Please configure one in settings.",
				},
				{ status: 400 },
			);
		}

		if (error.code === "P2002") {
			const target = error.meta?.target;
			return NextResponse.json(
				{
					error: `A record with this ${target ? target : "credential"} already exists.`,
				},
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{
				error: "An internal server error occurred while processing the admission.",
			},
			{ status: 500 },
		);
	}
}

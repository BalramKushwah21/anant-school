import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// GET: Fetch Admin Profile
export async function GET(request) {
	try {
        const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Unauthorized Request. Session or School ID missing.",
				},
				{ status: 401 }, // 401 Unauthorized
			);
		}

		 // Tenant isolation
		 // Tenant isolation
		// 1. Get Logged-in Admin Session
		// const session = await getServerSession(authOptions);
		// if (!session || !session.user) {
		//   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		// }

		// Mocking session for now (Replace with actual session variables)
		const userEmail = session.user.email;

		// 2. Query Database according to Schema
		// Assuming you have a User model connected to an AdminProfile/Employee model
		const adminData = await prisma.user.findUnique({
			where: {
				email: userEmail,
				// email: session.user.email
			},
			select: {
				id: true,
				email: true,
				username: true,
				userRole: true,
				// Nested relation fetch (Update "adminProfile" with your actual relation name in Prisma)
				adminProfile: {
					select: {
						profilePhoto: true,
						firstName: true,
						lastName: true,
						
						designation: true,
						department: true,
						status: true,
						gender: true,
						dob: true,
						bloodGroup: true,
						maritalStatus: true,
						mobileNumber: true,
						alternateMobile: true,
						address: true,
						city: true,
						state: true,
						pincode: true,
						qualification: true,
						experience: true,
						specialization: true,
					},
				},
			},
		});

		if (!adminData) {
			return NextResponse.json(
				{ error: "Admin profile not found" },
				{ status: 404 },
			);
		}

		// 3. Format data to match exactly what Frontend page.js expects
		const formattedData = {
			email: adminData.email,
			username: adminData.username,
			userRole: adminData.userRole,
			password: "••••••••••••••••", // Frontend requirement
			...adminData.adminProfile, // Spread the nested profile object
		};

		return NextResponse.json(formattedData, { status: 200 });
	} catch (error) {
		console.error("Error fetching admin profile:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// PUT: Update Admin Profile
export async function PUT(request) {
	try {

        const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Unauthorized Request. Session or School ID missing.",
				},
				{ status: 401 }, // 401 Unauthorized
			);
		}
		// const session = await getServerSession(authOptions);
		// if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userId = session.user.id; // Assuming you have user ID in the session
        const schoolId = session.user.schoolId; // Assuming you have school ID in the session
		const body = await request.json();

		// 1. Destructure Profile Fields
		const {
			firstName,
			lastName,
			gender,
			dob,
			bloodGroup,
			maritalStatus,
			mobileNumber,
			alternateMobile,
			address,
			city,
			state,
			pincode,
			designation,
			specialization,
			experience,
			qualification,
			profilePhoto,
		} = body;

		// 2. Perform Prisma Update on the Profile Relation Table
		const updatedProfile = await prisma.adminProfile.upsert({
			where: {
				userId: userId, // Yeh aapki variable hogi
			},
			update: {
				firstName,
				lastName,
				gender,
				dob: dob ? new Date(dob) : null,
				bloodGroup,
				maritalStatus,
				mobileNumber,
				alternateMobile,
				address,
				city,
				state,
				pincode,
				designation,
				specialization,
				experience,
				qualification,
				profilePhoto,
			},
			create: {
				firstName,
				lastName,
				gender,
				dob: dob ? new Date(dob) : null,
				bloodGroup,
				maritalStatus,
				mobileNumber,
				alternateMobile,
				address,
				city,
				state,
				pincode,
				designation,
				specialization,
				experience,
				qualification,
				profilePhoto,
				

				// ✅ FIX: Naya user banane ke bajaye existing user se connect karein
				user: {
					connect: { id: userId },
				},
				school: {
					connect: { id: schoolId },
				},
			},
		});


		return NextResponse.json(
			{
				message: "Profile metrics securely updated",
				profile: updatedProfile,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error updating profile:", error);
		return NextResponse.json(
			{ error: "Failed to sync updates to database" },
			{ status: 500 },
		);
	}
}

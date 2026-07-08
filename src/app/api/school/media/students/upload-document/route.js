import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";
// 👇 1. Prisma ko import karein
import { prisma } from "@/lib/prisma";

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;
		const userId = session?.user?.id;

		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("photo");
		const moduleName = formData.get("module");
		const type = formData.get("firstName") + formData.get("studentAadhar").slice(0, 4); // 'teachers' aayega
        console.log("Type:", type);
		if (!file || !moduleName || !userId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// 1. Convert File to Buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// 2. Define VPS Path (Adjacent to your Next.js project)
		const baseUploadDir = path.join(process.cwd(), "..", "school-media");
		const targetDir = path.join(baseUploadDir, schoolId, moduleName, type);

		// 3. Auto-create folder securely
		await fs.mkdir(targetDir, { recursive: true });

		// 4. Clean filename aur Directory me save karein (FILE DIR ME SAVE)
		const extension = file.name.split(".").pop();
		const fileName = `profile-${userId}.${extension}`;
		const filePath = path.join(targetDir, fileName);

		await fs.writeFile(filePath, buffer);

		// 5. Generate secure serve URL
		const fileUrl = `/api/school/media/${schoolId}/${moduleName}/${type}/${fileName}`;

		// =========================================================
		// 🚀 6. DATABASE (DB) ME PATH SAVE KARNA
		// =========================================================
		// Yahan hum Database me us particular user ya teacher ka record update kar rahe hain
		// Aapne 'Teacher' profile ke liye pucha tha, toh hum wahi table update karenge

		await prisma.studentDocument.update({
			where: {
				userId: userId, // Ya id: userId (Aapke schema ke according)
			},
			data: {
				studentPhoto: fileUrl, // DB me jo column name hai, usme url pass kar diya
			},
		});
		// (Note: Agar ye User table me save karna hai toh prisma.user.update likhein)

		return NextResponse.json(
			{
				success: true,
				message:
					"File uploaded and path saved to database successfully!",
				fileUrl: fileUrl,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("File upload error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

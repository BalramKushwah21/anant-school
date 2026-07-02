import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";

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
		const type = formData.get("type"); // 'teachers' aayega
		

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
		// Agar project /var/www/school-grid hai, toh media /var/www/school-media mein jayega
		const baseUploadDir = path.join(process.cwd(), "..", "school-media");
		const targetDir = path.join(baseUploadDir, schoolId, moduleName, type);

		// 3. Auto-create folder securely
		await fs.mkdir(targetDir, { recursive: true });

		// 4. Clean filename aur save karein
		const extension = file.name.split(".").pop();
		const fileName = `profile-${userId}.${extension}`;
		const filePath = path.join(targetDir, fileName);

		await fs.writeFile(filePath, buffer);

		// 5. Generate secure serve URL
		const fileUrl = `/api/school/media/${schoolId}/${moduleName}/${type}/${fileName}`;;

		return NextResponse.json(
			{
				message: "File uploaded successfully",
				url: fileUrl,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

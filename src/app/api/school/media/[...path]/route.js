import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
	try {
		// 1. Resolve Params (Next.js 15+ best practice)
		const resolvedParams = await params;

		// 2. URL se aane wale saare parts ko jod kar path banayein
		// Example: ['school_101', 'students', 'aadhar.pdf'] -> "school_101/students/aadhar.pdf"
		const relativePath = resolvedParams.path.join("/");

		// 3. Apna Base Directory define karein (Project folder ke theek bahar 'school-media' folder)
		const baseDir = path.join(process.cwd(), "..", "school-media");

		// 4. File ka exact absolute path banayein
		const absoluteFilePath = path.normalize(
			path.join(baseDir, relativePath),
		);

		// 5. 🛡️ SECURITY CHECK: Directory Traversal Hacking ko rokne ke liye
		// Ensure karein ki koi URL me "../../" laga kar server ki doosri files read na kar le
		if (!absoluteFilePath.startsWith(path.normalize(baseDir))) {
			return new NextResponse("Access Denied", { status: 403 });
		}

		// 6. Check karein ki kya file sach me disk par exist karti hai
		if (!fs.existsSync(absoluteFilePath)) {
			return new NextResponse("File not found", { status: 404 });
		}

		// 7. File ko read karein
		const fileBuffer = await new Promise((resolve, reject) => {
			fs.readFile(absoluteFilePath, (err, data) => {
				if (err) reject(err);
				else resolve(data);
			});
		});

		// 8. File ka Extension check karein taaki browser samajh sake file ka type kya hai
		const ext = path.extname(absoluteFilePath).toLowerCase();
		let contentType = "application/octet-stream"; // Default for unknown types

		if (ext === ".jpg" || ext === ".jpeg") {
			contentType = "image/jpeg";
		} else if (ext === ".png") {
			contentType = "image/png";
		} else if (ext === ".webp") {
			contentType = "image/webp";
		} else if (ext === ".pdf") {
			contentType = "application/pdf";
		}

		// 9. Response Bhejein (Sath me Cache-Control taaki dashboard fast load ho)
		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				// Ek baar load hone ke baad browser file ko 1 din (86400 sec) tak cache rakhega
				"Cache-Control": "public, max-age=86400, immutable",
			},
		});
	} catch (error) {
		console.error("Universal Media Server Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

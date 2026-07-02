import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	try {
		// Next.js 15 Rule: Await the params!
		const resolvedParams = await params;
		const slug = resolvedParams.slug;

		// Path Construct karna
		const filePath = path.join(
			process.cwd(),
			"..",
			"school-media",
			...slug,
		);

		// DEBUG: Terminal me dikhayega ki kis exact path par file dhoondh raha hai
		

		const fileBuffer = await fs.readFile(filePath);

		const filename = slug[slug.length - 1];
		const ext = path.extname(filename).toLowerCase();

		let mimeType = "image/jpeg";
		if (ext === ".png") mimeType = "image/png";
		if (ext === ".webp") mimeType = "image/webp";
		if (ext === ".gif") mimeType = "image/gif";

		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				"Content-Type": mimeType,
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch (error) {
		// DEBUG: Terminal me error batayega ki file kyu nahi mili
	

		return new NextResponse("Image not found", { status: 404 });
	}
}

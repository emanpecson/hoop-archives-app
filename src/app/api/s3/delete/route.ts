import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export async function DELETE(req: NextRequest) {
	const key = req.nextUrl.searchParams.get("key");

	if (!key) {
		return NextResponse.json(
			{ error: "Missing query parameter: key" },
			{ status: 400 }
		);
	}

	try {
		const command = new DeleteObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: key,
		});

		const res = await s3.send(command);
		console.log("S3 delete response:", res);
		return NextResponse.json(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

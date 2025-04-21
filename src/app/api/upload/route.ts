import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export async function GET(req: NextRequest) {
	const query = {
		filename: req.nextUrl.searchParams.get("filename"),
	};

	// const contentType = "video/mp4";

	if (query.filename) {
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			// ContentType: contentType,
			Key: query.filename,
		});
		const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

		console.log("sending presigned url:", presignedUrl);

		return NextResponse.json({ presignedUrl }, { status: 200 });
	}

	return NextResponse.json({ message: "Server error" }, { status: 500 });
}

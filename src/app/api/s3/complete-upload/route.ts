import { CompleteMultipartUploadCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (
		!body.uploadId ||
		!body.key ||
		!body.parts ||
		!Array.isArray(body.parts)
	) {
		return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	}

	const { uploadId, key, parts } = body;

	try {
		const command = new CompleteMultipartUploadCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: key,
			UploadId: uploadId,
			MultipartUpload: {
				Parts: parts,
			},
		});

		const res = await s3.send(command);
		return NextResponse.json({ location: res.Location }, { status: 200 });
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

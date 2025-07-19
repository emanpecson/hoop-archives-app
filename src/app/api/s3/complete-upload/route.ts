import { apiHandler } from "@/utils/server/api-handler";
import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const POST = apiHandler(async (req, _, aws) => {
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

		const res = await aws.s3.send(command);
		return NextResponse.json({ location: res.Location }, { status: 200 });
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
});

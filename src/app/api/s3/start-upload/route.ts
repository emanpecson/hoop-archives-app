import {
	CreateMultipartUploadCommand,
	S3Client,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

const oneHourInSeconds = 60 * 60;

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!body.fileName || !body.fileSize || !body.partSize) {
		return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	}

	const { fileName, fileSize, partSize } = body;

	try {
		const command = new CreateMultipartUploadCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: fileName,
		});

		const res = await s3.send(command);

		const partsCount = Math.ceil(fileSize / partSize);

		const presignedUrls = [];

		// part numbers must start from 1
		for (let partNumber = 1; partNumber <= partsCount; partNumber++) {
			const command = new UploadPartCommand({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: fileName,
				UploadId: res.UploadId,
				PartNumber: partNumber,
			});

			const url = await getSignedUrl(s3, command, {
				expiresIn: oneHourInSeconds,
			});

			presignedUrls.push(url);
		}

		console.log("Upload parts generated:", presignedUrls.length);
		return NextResponse.json(
			{ uploadId: res.UploadId, key: fileName, presignedUrls },
			{ status: 200 }
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

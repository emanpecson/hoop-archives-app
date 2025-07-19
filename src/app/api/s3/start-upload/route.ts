import { apiHandler } from "@/utils/server/api-handler";
import {
	CreateMultipartUploadCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const oneHourInSeconds = 60 * 60;

export const POST = apiHandler(async (req, _, aws) => {
	const { key, fileSize, partSize } = await req.json();

	if (!key || !fileSize || !partSize) {
		return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	}

	try {
		const command = new CreateMultipartUploadCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: key,
		});

		const res = await aws.s3.send(command);

		const partsCount = Math.ceil(fileSize / partSize);

		const presignedUrls = [];

		// part numbers must start from 1
		for (let partNumber = 1; partNumber <= partsCount; partNumber++) {
			const command = new UploadPartCommand({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: key,
				UploadId: res.UploadId,
				PartNumber: partNumber,
			});

			const url = await getSignedUrl(aws.s3, command, {
				expiresIn: oneHourInSeconds,
			});

			presignedUrls.push(url);
		}

		console.log("Upload parts generated:", presignedUrls.length);
		return NextResponse.json(
			{ uploadId: res.UploadId, presignedUrls },
			{ status: 200 }
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
});

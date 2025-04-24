import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
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
	const oneHourInSeconds = 60 * 60;
	const oneDayInSeconds = oneHourInSeconds * 24;

	const query = {
		filename: req.nextUrl.searchParams.get("filename"),
		bucketMethod: req.nextUrl.searchParams.get("bucketMethod"),
	};

	if (!query.filename) {
		return NextResponse.json(
			{ message: "Missing query: filename" },
			{ status: 400 }
		);
	}

	if (!query.bucketMethod) {
		return NextResponse.json(
			{ message: "Missing query: bucketMethod" },
			{ status: 400 }
		);
	}

	try {
		if (query.bucketMethod === "PUT") {
			const command = new PutObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: query.filename,
			});
			const presignedUrl = await getSignedUrl(s3, command, {
				expiresIn: oneHourInSeconds,
			});

			return NextResponse.json({ presignedUrl }, { status: 200 });
		}

		if (query.bucketMethod === "GET") {
			const command = new GetObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: query.filename,
			});
			const presignedUrl = await getSignedUrl(s3, command, {
				expiresIn: oneDayInSeconds,
			});

			return NextResponse.json({ presignedUrl }, { status: 200 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error, message: "Server error" },
			{ status: 500 }
		);
	}
}

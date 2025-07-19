import { apiHandler } from "@/utils/server/api-handler";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export const GET = apiHandler(async (req, _params, aws) => {
	const oneHourInSeconds = 60 * 60;
	const oneDayInSeconds = oneHourInSeconds * 24;

	const query = {
		key: req.nextUrl.searchParams.get("key"),
		bucketMethod: req.nextUrl.searchParams.get("bucketMethod"),
	};

	if (!query.key) {
		return NextResponse.json(
			{ message: "Missing query: key" },
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
				Key: query.key,
			});
			const presignedUrl = await getSignedUrl(aws.s3, command, {
				expiresIn: oneHourInSeconds,
			});

			return NextResponse.json({ presignedUrl }, { status: 200 });
		}

		if (query.bucketMethod === "GET") {
			const command = new GetObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: query.key,
			});
			const presignedUrl = await getSignedUrl(aws.s3, command, {
				expiresIn: oneDayInSeconds,
			});

			return NextResponse.json({ presignedUrl }, { status: 200 });
		}

		return NextResponse.json(
			{ error: "Bucket method does not match a path" },
			{ status: 400 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error, message: "Server error" },
			{ status: 500 }
		);
	}
});

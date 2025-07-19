import { apiHandler } from "@/utils/server/api-handler";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const DELETE = apiHandler(async (req, _, aws) => {
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

		const res = await aws.s3.send(command);
		console.log("S3 delete response:", res);
		return NextResponse.json(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
});

import { SqsUploadRequest } from "@/types/api/sqs-message";
import { apiHandler } from "@/utils/server/api-handler";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { NextResponse } from "next/server";

export const POST = apiHandler(async (req, _, aws) => {
	const body: SqsUploadRequest = await req.json();

	try {
		const command = new SendMessageCommand({
			QueueUrl: process.env.AWS_SQS_QUEUE_URL,
			DelaySeconds: 10,
			MessageBody: JSON.stringify(body),
		});

		await aws.sqs.send(command);

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
});

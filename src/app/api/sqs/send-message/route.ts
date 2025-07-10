import { SqsUploadRequest } from "@/types/api/sqs-message";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { NextRequest, NextResponse } from "next/server";

const client = new SQSClient({});

export async function POST(req: NextRequest) {
	const body: SqsUploadRequest = await req.json();

	try {
		const command = new SendMessageCommand({
			QueueUrl: process.env.AWS_SQS_QUEUE_URL,
			DelaySeconds: 10,
			MessageBody: JSON.stringify(body),
		});

		await client.send(command);

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

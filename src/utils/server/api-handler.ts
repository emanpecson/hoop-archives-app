import { getDdbClient } from "@/utils/server/ddb-client";
import { NextRequest, NextResponse } from "next/server";
import { getS3Client } from "./s3-client";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SQSClient } from "@aws-sdk/client-sqs";
import { getSqsClient } from "./sqs-client";

export type AwsClient = {
	ddb: DynamoDBClient;
	ddbDoc: DynamoDBDocumentClient;
	s3: S3Client;
	sqs: SQSClient;
};

type Handler<T> = (
	req: NextRequest,
	params: T,
	awsClient: AwsClient
) => Promise<NextResponse>;

// wrapper function that injects aws clients + performs existence checks
// * note: does not trigger errors for invalid creds, only on command "send"
export function apiHandler<T>(handler: Handler<T>) {
	return async (req: NextRequest, context: { params: T | Promise<T> }) => {
		const ddb = await getDdbClient();
		if (!ddb) {
			return NextResponse.json(
				{ error: "Could not setup DynamoDB client" },
				{ status: 500 }
			);
		}
		const ddbDoc = DynamoDBDocumentClient.from(ddb);

		const s3 = await getS3Client();
		if (!s3) {
			return NextResponse.json(
				{ error: "Could not setup S3 client" },
				{ status: 500 }
			);
		}

		const sqs = await getSqsClient();
		if (!sqs) {
			return NextResponse.json(
				{ error: "Could not setup SQS client" },
				{ status: 500 }
			);
		}

		const params = await context.params;

		return handler(req, params, { ddb, ddbDoc, s3, sqs });
	};
}

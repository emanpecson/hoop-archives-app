import { getDdbClient } from "@/utils/server/ddb-client";
import { NextRequest, NextResponse } from "next/server";
import { getS3Client } from "./s3-client";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export type AwsClient = {
	ddb: DynamoDBClient;
	ddbDoc: DynamoDBDocumentClient;
	s3: S3Client;
};

type Handler<T> = (
	req: NextRequest,
	params: T,
	awsClient: AwsClient
) => Promise<NextResponse>;

// wrapper function that injects aws clients + performs existence checks
export function apiHandler<T>(handler: Handler<T>) {
	return async (req: NextRequest, context: { params: T }) => {
		const ddb = await getDdbClient();
		const s3 = await getS3Client();

		if (!ddb) {
			return NextResponse.json(
				{ error: "Could not setup DynamoDB client" },
				{ status: 500 }
			);
		}
		const ddbDoc = DynamoDBDocumentClient.from(ddb);

		if (!s3) {
			return NextResponse.json(
				{ error: "Could not setup S3 client" },
				{ status: 500 }
			);
		}

		return handler(req, context.params, { ddb, ddbDoc, s3 });
	};
}

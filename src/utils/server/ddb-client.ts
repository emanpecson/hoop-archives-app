import { auth } from "@/auth";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const getDdbClient = async (): Promise<DynamoDBClient | null> => {
	const session = await auth();

	if (!session) return null;

	const { awsCredentials: creds } = session;

	const ddb = new DynamoDBClient({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: creds.AccessKeyId!,
			secretAccessKey: creds.SecretKey!,
			sessionToken: creds.SessionToken,
		},
	});

	return ddb;
};

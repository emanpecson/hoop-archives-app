import { auth } from "@/auth";
import { SQSClient } from "@aws-sdk/client-sqs";

export const getSqsClient = async (): Promise<SQSClient | null> => {
	const session = await auth();

	if (!session) return null;

	const { awsCredentials: creds } = session;

	const sqs = new SQSClient({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: creds.AccessKeyId!,
			secretAccessKey: creds.SecretKey!,
			sessionToken: creds.SessionToken,
		},
	});

	return sqs;
};

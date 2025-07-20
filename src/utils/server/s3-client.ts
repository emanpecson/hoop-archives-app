import { auth } from "@/auth";
import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = async (): Promise<S3Client | null> => {
	const session = await auth();

	if (!session) return null;

	const { awsCredentials: creds } = session;

	if (!creds) return null;

	const s3 = new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: creds.AccessKeyId!,
			secretAccessKey: creds.SecretKey!,
			sessionToken: creds.SessionToken,
		},
	});

	return s3;
};

import { Credentials } from "@aws-sdk/client-cognito-identity";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			givenName: string;
			familyName: string;
			username: string; // cognito: username
			groups?: string[]; // cognito: group
		} & DefaultSession["user"];
		accessToken: string;
		refreshToken: string;
		idToken: string; // cognito: aws credentials
		awsCredentials: Credentials;
	}

	interface User extends DefaultUser {
		groups?: string[];
	}
}

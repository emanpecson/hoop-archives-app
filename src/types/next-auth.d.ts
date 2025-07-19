import { Credentials } from "@aws-sdk/client-cognito-identity";

declare module "next-auth" {
	interface Session extends NextAuthSession {
		user: User & {
			username?: string;
			groups?: string[];
		};
		accessToken?: string;
		refreshToken?: string;
		idToken?: string;
		awsCredentials?: Credentials;
	}

	interface User {
		username?: string;
		groups?: string[];
	}
}

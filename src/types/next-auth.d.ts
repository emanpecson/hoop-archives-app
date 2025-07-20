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
		idTokenExpiration?: number;
		awsCredentials?: Credentials;
	}

	interface User {
		username?: string;
		groups?: string[];
	}

	interface JWT {
		idToken?: string;
		accessToken?: string;
		refreshToken?: string;
		awsCredentials?: Credentials;
		username?: string;
		email?: string;
		groups?: string[];
		exp?: number;
	}
}

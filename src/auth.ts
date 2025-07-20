import { fetchAwsCredentials } from "./utils/auth/credentials";
import NextAuth, { JWT } from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { Credentials } from "@aws-sdk/client-cognito-identity";
import { tokenIsExpired } from "./utils/auth/token";
import {
	CognitoTokenRefreshBodyRequest,
	CognitoTokenRefreshResponse,
} from "./types/api/cognito-token-refresh";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Cognito({
			clientId: process.env.AUTH_COGNITO_CLIENT_ID,
			clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET,
			issuer: process.env.AUTH_COGNITO_ISSUER,
		}),
	],
	// debug: true,

	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},

		// * account, profile, user -> provided on sign-in
		// * token -> provided on subsequent requests (session created/updated)
		async jwt({ token, account, profile }) {
			// set token data (only available on sign-in)
			if (account && profile) {
				token.idToken = account.id_token; // raw id token
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;

				// decoded id-token data
				token.iss = profile.iss;
				token.idTokenExpiration = profile.exp as number;
				token.email = profile.email;
				if (profile["cognito:groups"]) token.groups = profile["cognito:groups"];
				if (profile["cognito:username"])
					token.username = profile["cognito:username"];
			}

			try {
				// refresh on expiration
				if (tokenIsExpired(token as JWT)) {
					console.log("JWT: Token expired, refreshing...");

					const refreshEndpoint = `${process.env.APP_URL}/api/auth/cognito/refresh`;
					const res = await fetch(refreshEndpoint, {
						method: "POST",
						body: JSON.stringify({
							refreshToken: token.refreshToken,
							username: token.username,
						} as CognitoTokenRefreshBodyRequest),
					});

					if (res.ok) {
						const newTokens: CognitoTokenRefreshResponse = await res.json();
						token.idToken = newTokens.idToken;
						token.accessToken = newTokens.accessToken;

						// with the new token, we have to get the new aws creds
						const creds = await fetchAwsCredentials(token as JWT);
						token.awsCredentials = creds;
					} else {
						const { error } = await res.json();
						console.log("JWT Error:", error);
					}
				}

				// todo: if refresh token expires, log the user out

				if (!token.awsCredentials) {
					console.log("No AWS credentials, fetching...");

					const creds = await fetchAwsCredentials(token as JWT);
					token.awsCredentials = creds;
				}
			} catch (error) {
				console.error("JWT Error:", error);
			}

			return token;
		},

		// * data changes persist via token only
		async session({ session, token }) {
			// copy token data into session
			session.user.groups = (token.groups as string[]) ?? [];
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.idToken = token.idToken as string;
			session.idTokenExpiration = token.idTokenExpiration as number;
			session.user.username = token.username as string;
			session.awsCredentials = token.awsCredentials as Credentials;

			return session;
		},
	},
});

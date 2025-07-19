import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { Credentials } from "@aws-sdk/client-cognito-identity";
import { refreshCognitoTokens } from "./utils/auth/token";

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
		// * token -> provided on subsequent requests
		async jwt({ token, account, profile }) {
			// set token data (only available on sign-in)
			if (account && profile) {
				token.idToken = account.id_token; // raw id token
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;

				// decoded id-token data
				token.iss = profile.iss;
				token.exp = profile.exp as number;
				token.email = profile.email;
				if (profile["cognito:groups"]) token.groups = profile["cognito:groups"];
				if (profile["cognito:username"])
					token.username = profile["cognito:username"];
			}

			try {
				// refresh id-token on expiration
				const now = Math.floor(Date.now() / 1000); // current time converted to seconds

				if (token.exp && now > token.exp) {
					const expires = new Date(token.exp * 1000).toLocaleTimeString();
					console.log("Expires:", expires);

					console.log("Token expired, refreshing...");
					const { id_token, access_token } = await refreshCognitoTokens(
						token.refreshToken as string,
						token.username as string
					);
					token.idToken = id_token;
					token.accessToken = access_token;

					const newExpires = new Date(token.exp * 1000).toLocaleTimeString();
					console.log("Refreshed id token expires:", newExpires);
				}

				// todo: if refresh token expires, log the user out

				if (!token.awsCredentials) {
					// fetch aws credentials and add to session object
					const credsEndpoint = `${process.env.APP_URL}/api/auth/cognito?idToken=${token.idToken}`;
					const res = await fetch(credsEndpoint);

					if (res.ok) {
						const creds: Credentials = await res.json();
						token.awsCredentials = creds;
					} else {
						throw new Error("Error fetching user AWS credentials");
					}
				}
			} catch (error) {
				console.error(error);
			}

			return token;
		},

		async session({ session, token }) {
			// copy token data into session
			session.user.groups = (token.groups as string[]) ?? [];
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.idToken = token.idToken as string;
			session.user.username = token.username as string;
			session.awsCredentials = token.awsCredentials as Credentials;

			return session;
		},
	},
});

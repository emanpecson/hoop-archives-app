import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { jwtDecode } from "jwt-decode";
import { IdTokenPayload } from "./types/token";
import { Credentials } from "@aws-sdk/client-cognito-identity";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Cognito({
			clientId: process.env.AUTH_COGNITO_CLIENT_ID,
			clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET,
			issuer: process.env.AUTH_COGNITO_ISSUER,
		}),
	],
	debug: true,

	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},
		async jwt({ token, account, profile }) {
			if (account && profile) {
				token.idToken = account.id_token; // raw id token
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;

				// store groups if they exist
				if (profile["cognito:groups"]) {
					token.groups = profile["cognito:groups"];
				}

				// re-form token attributes to the expected
				// token.givenName = token.given_name || session.user.givenName || "";
				// token.familyName = token.family_name || session.user.familyName || "";
			}

			const decodedIdToken: IdTokenPayload = jwtDecode(token.idToken as string);
			if (decodedIdToken["cognito:username"]) {
				token.username = decodedIdToken["cognito:username"];
			}
			token.iss = decodedIdToken.iss;

			return token;
		},
		async session({ session, token }) {
			session.user.givenName = token.given_name as string;
			session.user.familyName = token.given_name as string;
			session.user.groups = (token.groups as string[]) ?? [];
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.idToken = token.idToken as string;
			session.user.username = token.username as string;

			try {
				const credsEndpoint = `${process.env.APP_URL}/api/cognito?idToken=${session.idToken}`;
				const res = await fetch(credsEndpoint);

				if (res.ok) {
					const creds: Credentials = await res.json();
					session.awsCredentials = creds;
				} else {
					throw Error("Could not fetch AWS credentials");
				}
			} catch (error) {
				console.log("Error fetching AWS credentials:", error);
			}

			return session;
		},
	},
});

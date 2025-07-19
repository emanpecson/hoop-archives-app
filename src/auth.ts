import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { jwtDecode } from "jwt-decode";
import { IdTokenPayload } from "./types/token";
import { Credentials } from "@aws-sdk/client-cognito-identity";
import { refreshCognitoTokens } from "./utils/token";

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

			console.log("token:", token);
			return token;
		},
		async session({ session, token }) {
			// copy token data into session
			session.user.givenName = token.given_name as string;
			session.user.familyName = token.given_name as string;
			session.user.groups = (token.groups as string[]) ?? [];
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.idToken = token.idToken as string;
			session.user.username = token.username as string;

			try {
				// refresh id-token on expiration
				const decodedIdToken: IdTokenPayload = jwtDecode(session.idToken);
				const now = Math.floor(Date.now() / 1000); // convert to seconds

				if (!!decodedIdToken.exp && now < decodedIdToken.exp) {
					console.log("Token expired, refreshing...");
					const { id_token, access_token } = await refreshCognitoTokens(
						session.refreshToken,
						session.user.username
					);
					session.idToken = id_token;
					session.accessToken = access_token;
				}

				// fetch aws credentials and add to session object
				const credsEndpoint = `${process.env.APP_URL}/api/cognito?idToken=${session.idToken}`;
				const res = await fetch(credsEndpoint);

				if (res.ok) {
					const creds: Credentials = await res.json();
					session.awsCredentials = creds;
				} else {
					throw Error("Could not fetch AWS credentials");
				}
			} catch (error) {
				console.log("Error modifying session token", error);
			}

			return session;
		},
	},
});

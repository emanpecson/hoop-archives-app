import {
	CognitoTokenRefreshBodyRequest,
	CognitoTokenRefreshResponse,
} from "@/types/api/cognito-token-refresh";
import {
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest, NextResponse } from "next/server";

const generateSecretHashEdge = async (
	clientId: string,
	clientSecret: string,
	username: string
): Promise<string> => {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(clientSecret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const data = enc.encode(username + clientId);
	const signature = await crypto.subtle.sign("HMAC", key, data);

	return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

const client = new CognitoIdentityProviderClient({
	region: process.env.AWS_REGION,
});

// refresh token from aws is long-lived (~30 days);
// we need to refresh the `idToken` for our temporary aws creds
export const POST = async (req: NextRequest) => {
	const body: CognitoTokenRefreshBodyRequest = await req.json();

	const input: InitiateAuthCommandInput = {
		AuthFlow: "REFRESH_TOKEN_AUTH",
		ClientId: process.env.AUTH_COGNITO_CLIENT_ID!,
		AuthParameters: { REFRESH_TOKEN: body.refreshToken },
	};

	input.AuthParameters!.SECRET_HASH = await generateSecretHashEdge(
		process.env.AUTH_COGNITO_CLIENT_ID!,
		process.env.AUTH_COGNITO_CLIENT_SECRET!,
		body.username
	);

	try {
		const command = new InitiateAuthCommand(input);
		const res = await client.send(command);

		if (!res.AuthenticationResult)
			throw new Error("No authentication result returned");

		const { IdToken: idToken, AccessToken: accessToken } =
			res.AuthenticationResult;
		if (!idToken || !accessToken)
			return NextResponse.json(
				{ error: "Missing tokens in authentication result" },
				{ status: 500 }
			);

		const newTokens: CognitoTokenRefreshResponse = { idToken, accessToken };
		return NextResponse.json(newTokens, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
};

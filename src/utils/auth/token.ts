import {
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

// refresh token from aws is long-lived (~30 days);
// we need to refresh the `idToken` for our temporary aws creds
export async function refreshCognitoTokens(
	refreshToken: string,
	username: string
) {
	const client = new CognitoIdentityProviderClient({
		region: process.env.AWS_REGION,
	});

	const input: InitiateAuthCommandInput = {
		AuthFlow: "REFRESH_TOKEN_AUTH",
		ClientId: process.env.AUTH_COGNITO_CLIENT_ID!,
		AuthParameters: { REFRESH_TOKEN: refreshToken },
	};

	if (process.env.AUTH_COGNITO_CLIENT_SECRET) {
		input.AuthParameters!.SECRET_HASH = await generateSecretHashEdge(
			process.env.AUTH_COGNITO_CLIENT_ID!,
			process.env.AUTH_COGNITO_CLIENT_SECRET,
			username
		);
	}

	try {
		const command = new InitiateAuthCommand(input);
		const response = await client.send(command);

		if (!response.AuthenticationResult) {
			throw new Error("No authentication result returned");
		}

		return {
			id_token: response.AuthenticationResult.IdToken!,
			access_token: response.AuthenticationResult.AccessToken!,
		};
	} catch (error) {
		console.error("Token refresh failed:", error);
		throw error;
	}
}

async function generateSecretHashEdge(
	clientId: string,
	clientSecret: string,
	username: string
): Promise<string> {
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

	// Convert ArrayBuffer to base64
	return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

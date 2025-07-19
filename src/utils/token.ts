import { createHmac } from "crypto";
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
		input.AuthParameters!.SECRET_HASH = generateSecretHash(
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

function generateSecretHash(
	clientId: string,
	clientSecret: string,
	username: string
): string {
	return createHmac("sha256", clientSecret)
		.update(username + clientId)
		.digest("base64");
}

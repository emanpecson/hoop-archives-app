import { Credentials } from "@aws-sdk/client-cognito-identity";
import { JWT } from "next-auth";

// fetch aws credentials and add to session object
export const fetchAwsCredentials = async (token: JWT) => {
	const credsEndpoint = `${process.env.APP_URL}/api/auth/cognito/credentials`;
	const res = await fetch(credsEndpoint, {
		method: "POST",
		body: JSON.stringify({ idToken: token.idToken }),
	});

	if (res.ok) {
		const creds: Credentials = await res.json();
		return creds;
	} else {
		const { error } = await res.json();
		throw error;
	}
};

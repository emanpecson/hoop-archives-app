import { IdTokenPayload } from "@/types/token";
import {
	CognitoIdentityClient,
	GetIdCommand,
	GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

const client = new CognitoIdentityClient({ region: "us-west-2" });

export async function GET(req: NextRequest) {
	const idToken = req.nextUrl.searchParams.get("idToken");

	if (!idToken) {
		return NextResponse.json(
			{ error: "Missing query param: idToken" },
			{ status: 400 }
		);
	}

	const decodedIdToken: IdTokenPayload = await jwtDecode(idToken);
	const rawIdToken = String(decodedIdToken.iss);
	const issuer = rawIdToken.slice(rawIdToken.indexOf("cognito"));

	try {
		const identityId = await client.send(
			new GetIdCommand({
				IdentityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
				Logins: { [issuer]: idToken },
			})
		);

		const res = await client.send(
			new GetCredentialsForIdentityCommand({
				IdentityId: identityId.IdentityId,
				Logins: { [issuer]: idToken },
			})
		);

		return NextResponse.json(res.Credentials, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

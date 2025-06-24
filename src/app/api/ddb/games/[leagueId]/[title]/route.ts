import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
	req: NextRequest,
	{ params }: { params: { leagueId: string; title: string } }
) {
	console.log("params:", params);
	const { leagueId, title } = params;

	try {
		const command = new GetCommand({
			TableName: process.env.AWS_DDB_GAMES_TABLE,
			Key: {
				leagueId, // partition key
				title, // sort key
			},
		});

		const { Item } = await docClient.send(command);
		if (!Item) {
			return NextResponse.json(
				{ error: "Could not retrieve item" },
				{ status: 500 }
			);
		}

		return NextResponse.json(Item, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

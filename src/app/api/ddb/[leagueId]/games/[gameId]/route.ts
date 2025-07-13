import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; gameId: string }> }
) {
	const { leagueId, gameId } = await params;

	try {
		const command = new GetCommand({
			TableName: process.env.AWS_DDB_GAMES_TABLE,
			Key: { leagueId, gameId },
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

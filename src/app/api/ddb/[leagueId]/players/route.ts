import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import {
	DynamoDBDocumentClient,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string }> }
) {
	const { leagueId } = await params;

	try {
		const queryInput: QueryCommandInput = {
			TableName: process.env.AWS_DDB_PLAYERS_TABLE,
			KeyConditionExpression: "leagueId = :leagueId",
			ExpressionAttributeValues: { ":leagueId": leagueId },
		};

		const { Items } = await docClient.send(new QueryCommand(queryInput));

		return NextResponse.json(Items, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

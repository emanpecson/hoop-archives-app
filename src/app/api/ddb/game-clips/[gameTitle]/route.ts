import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ gameTitle: string }> }
) {
	const { gameTitle } = await params;

	try {
		const queryInput: QueryCommandInput = {
			TableName: process.env.AWS_DDB_GAME_CLIPS_TABLE,
			KeyConditionExpression: "gameTitle = :gameTitle",
			ExpressionAttributeValues: { ":gameTitle": gameTitle },
		};

		const { Items } = await docClient.send(new QueryCommand(queryInput));

		return NextResponse.json(Items, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

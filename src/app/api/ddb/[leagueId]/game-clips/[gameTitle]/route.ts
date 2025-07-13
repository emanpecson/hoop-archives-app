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
	{ params }: { params: Promise<{ leagueId: string; gameTitle: string }> }
) {
	const { gameTitle, leagueId } = await params;

	try {
		const queryInput: QueryCommandInput = {
			TableName: process.env.AWS_DDB_CLIPS_TABLE,
			IndexName: process.env.AWS_DDB_CLIPS_GSI_GAME_TITLE,
			KeyConditionExpression: "leagueId = :leagueId AND gameTitle = :gameTitle",
			ExpressionAttributeValues: {
				":gameTitle": gameTitle,
				":leagueId": leagueId,
			},
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

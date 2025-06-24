import { NewGameRequestBody } from "@/types/api/new-game";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import {
	BatchWriteCommand,
	DynamoDBDocumentClient,
	PutCommand,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import processExclusiveStartKey from "@/utils/server/process-exclusive-start-key";
import { PaginatedGamesResponse } from "@/types/api/paginated-games";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req: NextRequest) {
	const query = {
		exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
		leagueId: req.nextUrl.searchParams.get("leagueId"),
		// * potentially more filters
	};

	console.log("query:", query);
	console.log(
		"processed key:",
		processExclusiveStartKey(query.exclusiveStartKey as string)
	);
	console.log(
		"processed key:",
		processExclusiveStartKey(String(query.exclusiveStartKey))
	);

	if (!query.leagueId) {
		return NextResponse.json(
			{ error: "Missing query parameter: leagueId" },
			{ status: 400 }
		);
	}

	if (!query.exclusiveStartKey) {
		return NextResponse.json(
			{ error: "Missing query parameter: exclusiveStartKey" },
			{ status: 400 }
		);
	}

	try {
		const queryInput: QueryCommandInput = {
			TableName: process.env.AWS_DDB_GAMES_TABLE,
			Limit: 12,
			ExclusiveStartKey: processExclusiveStartKey(query.exclusiveStartKey),
			KeyConditionExpression: "#leagueId = :leagueId",
			ExpressionAttributeNames: { "#leagueId": "leagueId" },
			ExpressionAttributeValues: { ":leagueId": query.leagueId },
		};

		const { Items, LastEvaluatedKey } = await docClient.send(
			new QueryCommand(queryInput)
		);

		return NextResponse.json(
			{
				games: Items,
				lastEvaluatedKey: LastEvaluatedKey,
			} as PaginatedGamesResponse,
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const { game, clips }: NewGameRequestBody = await req.json();

	if (!game || !clips || !Array.isArray(clips) || clips.length === 0) {
		return NextResponse.json(
			{ error: "Missing request body" },
			{ status: 400 }
		);
	}

	try {
		// create game w/ game clips
		const putCommand = new PutCommand({
			TableName: process.env.AWS_DDB_GAMES_TABLE,
			Item: game,
		});
		await docClient.send(putCommand);

		const batchWriteCommand = new BatchWriteCommand({
			RequestItems: {
				GameClips: clips.map((clip) => ({
					PutRequest: { Item: clip },
				})),
			},
		});
		await docClient.send(batchWriteCommand);

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

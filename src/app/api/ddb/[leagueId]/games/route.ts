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
import { Game } from "@/types/model/game";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const gameFilter = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items: Record<string, any>[] | undefined,
	title: string | null,
	startDate: string | null,
	endDate: string | null,
	playerIds: string[] | null
) => {
	if (items) {
		let filtered = items as Game[];

		if (title && title !== "undefined") {
			filtered = filtered.filter((g) => g.title.startsWith(title));
		}
		if (startDate && startDate !== "undefined") {
			filtered = filtered.filter((g) => g.date >= new Date(startDate));
		}
		if (endDate && endDate !== "undefined") {
			filtered = filtered.filter((g) => g.date <= new Date(endDate));
		}
		if (playerIds && playerIds.length > 0 && playerIds[0] !== "") {
			filtered = filtered.filter((g) =>
				g.away
					.concat(g.home)
					.some((player) => playerIds.includes(player.playerId))
			);
		}

		return filtered;
	}
	return [];
};

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string }> }
) {
	const { leagueId } = await params;
	const query = {
		exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
		title: req.nextUrl.searchParams.get("title") || null,
		startDate: req.nextUrl.searchParams.get("startDate") || null,
		endDate: req.nextUrl.searchParams.get("endDate") || null,
		playerIds: req.nextUrl.searchParams.getAll("playerIds[]") || null,
	};

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
			ExpressionAttributeValues: { ":leagueId": leagueId },
		};

		const { Items, LastEvaluatedKey } = await docClient.send(
			new QueryCommand(queryInput)
		);

		const filteredGames = gameFilter(
			Items,
			query.title,
			query.startDate,
			query.endDate,
			query.playerIds
		);

		return NextResponse.json(
			{
				games: filteredGames,
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

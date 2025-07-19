import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { NewGameRequestBody } from "@/types/api/new-game";
import { NextRequest, NextResponse } from "next/server";
import {
	PutCommand,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import processExclusiveStartKey from "@/utils/server/process-exclusive-start-key";
import { PaginatedGamesResponse } from "@/types/api/paginated-games";
import { filterGames } from "@/utils/server/filter-content";

export const GET = apiHandler(
	async (
		req: NextRequest,
		{ params }: { params: Promise<{ leagueId: string }> },
		aws: AwsClient
	) => {
		const { leagueId } = await params;
		const { searchParams } = req.nextUrl;
		const query = {
			exclusiveStartKey: searchParams.get("exclusiveStartKey"),
			title: searchParams.get("title") || null,
			startDate: searchParams.get("startDate") || null,
			endDate: searchParams.get("endDate") || null,
			playerIds: searchParams.getAll("playerIds[]") || null,
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
				KeyConditionExpression: "leagueId = :leagueId",
				ExpressionAttributeValues: { ":leagueId": leagueId },
			};

			const { Items, LastEvaluatedKey } = await aws.ddbDoc.send(
				new QueryCommand(queryInput)
			);

			const filteredGames = filterGames(
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
);

export const POST = apiHandler(async (req, _params, aws) => {
	const { game }: NewGameRequestBody = await req.json();

	if (!game) {
		return NextResponse.json(
			{ error: "Missing request body" },
			{ status: 400 }
		);
	}

	try {
		const putCommand = new PutCommand({
			TableName: process.env.AWS_DDB_GAMES_TABLE,
			Item: game,
		});
		await aws.ddbDoc.send(putCommand);

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
});

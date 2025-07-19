import { Player } from "@/types/model/player";
import { AttributeValue, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { Draft } from "@/types/model/draft";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import processExclusiveStartKey from "@/utils/server/process-exclusive-start-key";
import { PaginatedDraftsResponse } from "@/types/api/paginated-drafts";
import { apiHandler, AwsClient } from "@/utils/server/api-handler";

type Context = {
	leagueId: string;
};

export const GET = apiHandler<Context>(
	async (req: NextRequest, { leagueId }: Context, aws: AwsClient) => {
		const query = {
			exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
		};

		if (!query.exclusiveStartKey) {
			return NextResponse.json(
				{ error: "Missing query parameter: exclusiveStartKey" },
				{ status: 400 }
			);
		}

		try {
			const { Items, LastEvaluatedKey } = await aws.ddbDoc.send(
				new QueryCommand({
					TableName: process.env.AWS_DDB_DRAFTS_TABLE,
					Limit: 12,
					ExclusiveStartKey: processExclusiveStartKey(query.exclusiveStartKey),
					KeyConditionExpression: "leagueId = :leagueId",
					ExpressionAttributeValues: { ":leagueId": leagueId },
				})
			);

			return NextResponse.json(
				{
					drafts: Items,
					lastEvaluatedKey: LastEvaluatedKey,
				} as PaginatedDraftsResponse,
				{ status: 200 }
			);
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

export const POST = apiHandler<Context>(
	async (req: NextRequest, { leagueId }: Context, aws: AwsClient) => {
		const draft: Draft = await req.json();
		console.log("Draft body request:", draft);

		if (!draft) {
			return NextResponse.json(
				{ error: "Missing body request" },
				{ status: 400 }
			);
		}

		const mapPlayersToAttributeValue = (players: Player[]) => ({
			L: players.map((player) => ({
				M: {
					playerId: { S: player.playerId },
					firstName: { S: player.firstName },
					lastName: { S: player.lastName },
					fullName: { S: player.fullName },
					leagueId: { S: leagueId },
				},
			})),
		});

		try {
			const item: Record<string, AttributeValue> = {
				leagueId: { S: leagueId },
				draftId: { S: draft.draftId },
				title: { S: draft.title },
				bucketKey: { S: draft.bucketKey },
				date: { S: draft.date },
				type: { S: draft.type },
				clipDrafts: { L: [] },
				home: mapPlayersToAttributeValue(draft.home),
				away: mapPlayersToAttributeValue(draft.away),
			};

			const command = new PutItemCommand({
				TableName: process.env.AWS_DDB_DRAFTS_TABLE,
				Item: item,
			});

			const res = await aws.ddb.send(command);
			return NextResponse.json(res, { status: 200 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

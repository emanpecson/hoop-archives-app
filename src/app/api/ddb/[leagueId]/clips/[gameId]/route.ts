import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type Context = {
	leagueId: string;
	gameId: string;
};

export const GET = apiHandler<Context>(
	async (_req: NextRequest, ctx: Context, aws: AwsClient) => {
		const { gameId, leagueId } = ctx;

		try {
			const queryInput: QueryCommandInput = {
				TableName: process.env.AWS_DDB_CLIPS_TABLE,
				IndexName: process.env.AWS_DDB_CLIPS_GSI_GAME_ID,
				KeyConditionExpression: "leagueId = :leagueId AND gameId = :gameId",
				ExpressionAttributeValues: { ":gameId": gameId, ":leagueId": leagueId },
			};

			const { Items } = await aws.ddbDoc.send(new QueryCommand(queryInput));

			return NextResponse.json(Items, { status: 200 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

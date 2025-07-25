import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type Context = {
	leagueId: string;
	gameId: string;
};

export const GET = apiHandler<Context>(
	async (_req: NextRequest, ctx: Context, aws: AwsClient) => {
		const { leagueId, gameId } = ctx;

		try {
			const command = new GetCommand({
				TableName: process.env.AWS_DDB_GAMES_TABLE,
				Key: { leagueId, gameId },
			});

			const { Item } = await aws.ddbDoc.send(command);
			if (!Item) {
				return NextResponse.json(
					{ error: "Could not retrieve item" },
					{ status: 500 }
				);
			}

			return NextResponse.json(Item, { status: 200 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

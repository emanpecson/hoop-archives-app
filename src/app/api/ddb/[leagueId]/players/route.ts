import { NextRequest, NextResponse } from "next/server";
import {
	PutCommand,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { NewPlayerRequestBody } from "@/types/api/new-player";
import { Player } from "@/types/model/player";
import { generateId } from "@/utils/generate-id";
import { apiHandler, AwsClient } from "@/utils/server/api-handler";

type Context = {
	leagueId: string;
};

export const GET = apiHandler<Context>(
	async (_req: NextRequest, { leagueId }: Context, aws: AwsClient) => {
		try {
			const queryInput: QueryCommandInput = {
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				KeyConditionExpression: "leagueId = :leagueId",
				ExpressionAttributeValues: { ":leagueId": leagueId },
			};

			const { Items } = await aws.ddbDoc.send(new QueryCommand(queryInput));

			return NextResponse.json(Items, { status: 200 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

export const POST = apiHandler<Context>(
	async (req: NextRequest, { leagueId }: Context, aws: AwsClient) => {
		const { firstName, lastName, imageUrl }: NewPlayerRequestBody =
			await req.json();

		const player: Player = {
			leagueId,
			firstName,
			lastName,
			imageUrl,
			fullName: `${firstName} ${lastName}`,
			playerId: generateId("player"),
		};

		try {
			const putCommand = new PutCommand({
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				Item: player,
			});

			await aws.ddbDoc.send(putCommand);
			return NextResponse.json(player, { status: 200 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

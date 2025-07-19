import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler(
	async (
		_req: NextRequest,
		{ params }: { params: Promise<{ leagueId: string; gameId: string }> },
		aws: AwsClient
	) => {
		const { gameId, leagueId } = await params;

		try {
			const queryInput: QueryCommandInput = {
				TableName: process.env.AWS_DDB_CLIPS_TABLE,
				IndexName: process.env.AWS_DDB_CLIPS_GSI_GAME_TITLE,
				KeyConditionExpression: "leagueId = :leagueId AND gameId = :gameId",
				ExpressionAttributeValues: {
					":gameId": gameId,
					":leagueId": leagueId,
				},
			};

			const { Items } = await aws.ddbDoc.send(new QueryCommand(queryInput));

			return NextResponse.json(Items, { status: 200 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Server error: " + error },
				{ status: 500 }
			);
		}
	}
);

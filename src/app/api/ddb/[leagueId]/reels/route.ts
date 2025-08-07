import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { NextRequest, NextResponse } from "next/server";
import {
	PutCommand,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import processExclusiveStartKey from "@/utils/server/process-exclusive-start-key";
import { filterReels } from "@/utils/server/filter-content";
import { PaginatedReelsResponse } from "@/types/api/paginated-reels";
import { NewReelRequestBody } from "@/types/api/new-reel";

type Context = {
	leagueId: string;
};

export const GET = apiHandler<Context>(
	async (req: NextRequest, { leagueId }: Context, aws: AwsClient) => {
		const { searchParams } = req.nextUrl;
		const query = {
			exclusiveStartKey: searchParams.get("exclusiveStartKey"),
			title: searchParams.get("title") || null,
		};

		if (!query.exclusiveStartKey) {
			return NextResponse.json(
				{ error: "Missing query parameter: exclusiveStartKey" },
				{ status: 400 }
			);
		}

		try {
			const queryInput: QueryCommandInput = {
				TableName: process.env.AWS_DDB_REELS_TABLE,
				Limit: 12,
				ExclusiveStartKey: processExclusiveStartKey(query.exclusiveStartKey),
				KeyConditionExpression: "leagueId = :leagueId",
				ExpressionAttributeValues: { ":leagueId": leagueId },
			};

			const { Items, LastEvaluatedKey } = await aws.ddbDoc.send(
				new QueryCommand(queryInput)
			);

			const filteredReels = filterReels(Items, query.title);

			return NextResponse.json(
				{
					reels: filteredReels,
					lastEvaluatedKey: LastEvaluatedKey,
				} as PaginatedReelsResponse,
				{ status: 200 }
			);
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

export const POST = apiHandler(async (req, _, aws) => {
	const { reel }: NewReelRequestBody = await req.json();

	if (!reel) {
		return NextResponse.json(
			{ error: "Missing request body" },
			{ status: 400 }
		);
	}

	try {
		const putCommand = new PutCommand({
			TableName: process.env.AWS_DDB_REELS_TABLE,
			Item: reel,
		});
		await aws.ddbDoc.send(putCommand);

		return new NextResponse(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
});

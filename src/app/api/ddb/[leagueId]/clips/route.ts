import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { filterClips } from "@/utils/server/filter-content";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler(
	async (
		req: NextRequest,
		{ params }: { params: Promise<{ leagueId: string }> },
		aws: AwsClient
	) => {
		const { leagueId } = await params;
		const query = req.nextUrl.searchParams;

		try {
			const queryInput: QueryCommandInput = {
				TableName: process.env.AWS_DDB_CLIPS_TABLE,
				KeyConditionExpression: "leagueId = :leagueId",
				ExpressionAttributeValues: { ":leagueId": leagueId },
			};

			const { Items } = await aws.ddbDoc.send(new QueryCommand(queryInput));
			const filteredClips = filterClips(Items, query);

			return NextResponse.json(filteredClips, { status: 200 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

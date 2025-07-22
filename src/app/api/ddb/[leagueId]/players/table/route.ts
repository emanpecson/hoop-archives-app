import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import processExclusiveStartKey from "@/utils/server/process-exclusive-start-key";
import { QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type Context = {
	leagueId: string;
};

export const GET = apiHandler(
	async (req: NextRequest, { leagueId }: Context, aws: AwsClient) => {
		const query = {
			exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
			search: req.nextUrl.searchParams.get("search"),
		};

		if (!query.exclusiveStartKey) {
			return NextResponse.json(
				{ error: "Missing query parameter: exclusiveStartKey" },
				{ status: 400 }
			);
		}

		try {
			const input: QueryCommandInput = {
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				IndexName: process.env.AWS_DDB_PLAYERS_GSI_FULL_NAME,
				Limit: 4,
				ExclusiveStartKey: processExclusiveStartKey(query.exclusiveStartKey),
			};

			// if query provided, search entire table for full name
			if (query.search) {
				input.KeyConditionExpression =
					"leagueId = :leagueId AND begins_with(fullName, :fullName)";
				input.ExpressionAttributeValues = {
					":leagueId": leagueId,
					":fullName": query.search,
				};
			} else {
				input.KeyConditionExpression = "leagueId = :leagueId";
				input.ExpressionAttributeValues = { ":leagueId": leagueId };
			}

			const { Items, LastEvaluatedKey } = await aws.ddbDoc.send(
				new QueryCommand(input)
			);
			return NextResponse.json({ Items, LastEvaluatedKey }, { status: 200 });
		} catch (err) {
			console.log(err);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

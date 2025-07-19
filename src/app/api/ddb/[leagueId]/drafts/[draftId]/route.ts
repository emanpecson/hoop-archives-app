import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { DeleteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type Context = {
	leagueId: string;
	draftId: string;
};

export const GET = apiHandler<Context>(
	async (_req: NextRequest, ctx: Context, aws: AwsClient) => {
		const { leagueId, draftId } = ctx;

		try {
			const command = new GetItemCommand({
				TableName: process.env.AWS_DDB_DRAFTS_TABLE,
				Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
			});

			const { Item } = await aws.ddb.send(command);
			if (!Item) {
				return NextResponse.json(
					{ error: "Could not retrieve item" },
					{ status: 500 }
				);
			}

			return NextResponse.json(unmarshall(Item), { status: 200 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Server error: " + error },
				{ status: 500 }
			);
		}
	}
);

export const DELETE = apiHandler<Context>(
	async (req: NextRequest, ctx: Context, aws: AwsClient) => {
		const { leagueId, draftId } = ctx;

		try {
			const command = new DeleteItemCommand({
				TableName: process.env.AWS_DDB_DRAFTS_TABLE,
				Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
			});

			await aws.ddb.send(command);
			return NextResponse.json(null, { status: 204 });
		} catch (error) {
			console.error(error);
			return NextResponse.json({ error: "Server error" }, { status: 500 });
		}
	}
);

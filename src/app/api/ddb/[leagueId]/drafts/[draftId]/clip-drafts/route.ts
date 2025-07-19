import { ClipDraft } from "@/types/clip-draft";
import { apiHandler, AwsClient } from "@/utils/server/api-handler";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type Context = {
	leagueId: string;
	draftId: string;
};

export const POST = apiHandler<Context>(
	async (req: NextRequest, ctx: Context, aws: AwsClient) => {
		const { leagueId, draftId } = ctx;
		const clip: ClipDraft = await req.json();

		if (!clip)
			return NextResponse.json(
				{ error: "Missing body request" },
				{ status: 400 }
			);

		try {
			const command = new UpdateItemCommand({
				TableName: process.env.AWS_DDB_DRAFTS_TABLE,
				Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
				UpdateExpression:
					"SET clipDrafts = list_append(if_not_exists(clipDrafts, :empty), :clip)",
				ExpressionAttributeValues: marshall({
					":clip": [clip], // wrap in array to append
					":empty": [], // fallback
				}),
			});

			const res = await aws.ddb.send(command);
			return NextResponse.json(res, { status: 200 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Server error: " + error },
				{ status: 500 }
			);
		}
	}
);

export const PUT = apiHandler<Context>(
	async (req: NextRequest, ctx: Context, aws: AwsClient) => {
		const { leagueId, draftId } = ctx;
		const query = { clipIndex: req.nextUrl.searchParams.get("clipIndex") };
		const clip: ClipDraft = await req.json();

		if (!query.clipIndex)
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);

		if (!clip)
			return NextResponse.json(
				{ error: "Missing body request" },
				{ status: 400 }
			);

		try {
			const command = new UpdateItemCommand({
				TableName: process.env.AWS_DDB_DRAFTS_TABLE,
				Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
				UpdateExpression: `SET clipDrafts[${query.clipIndex}] = :clip`,
				ExpressionAttributeValues: marshall({ ":clip": clip }),
			});

			await aws.ddb.send(command);
			return new NextResponse(null, { status: 204 });
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
		const query = { clipIndex: req.nextUrl.searchParams.get("clipIndex") };

		if (!query.clipIndex)
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);

		try {
			const command = new UpdateItemCommand({
				TableName: process.env.AWS_DDB_DRAFTS_TABLE,
				Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
				UpdateExpression: `REMOVE clipDrafts[${query.clipIndex}]`,
			});

			await aws.ddb.send(command);
			return new NextResponse(null, { status: 204 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Server error: " + error },
				{ status: 500 }
			);
		}
	}
);

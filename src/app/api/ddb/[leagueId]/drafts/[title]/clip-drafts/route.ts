import { ClipDraft } from "@/types/clip-draft";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; title: string }> }
) {
	const { leagueId, title } = await params;
	const clip: ClipDraft = await req.json();

	if (!clip)
		return NextResponse.json(
			{ error: "Missing body request" },
			{ status: 400 }
		);

	try {
		const command = new UpdateItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: { leagueId: { S: leagueId }, title: { S: title } },
			UpdateExpression:
				"SET clipDrafts = list_append(if_not_exists(clipDrafts, :empty), :clip)",
			ExpressionAttributeValues: marshall({
				":clip": [clip], // wrap in array to append
				":empty": [], // fallback
			}),
		});

		const res = await client.send(command);
		return NextResponse.json(res, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; title: string }> }
) {
	const { leagueId, title } = await params;
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
			Key: { leagueId: { S: leagueId }, title: { S: title } },
			UpdateExpression: `SET clipDrafts[${query.clipIndex}] = :clip`,
			ExpressionAttributeValues: marshall({ ":clip": clip }),
		});

		await client.send(command);
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; title: string }> }
) {
	const { leagueId, title } = await params;
	const query = { clipIndex: req.nextUrl.searchParams.get("clipIndex") };

	if (!query.clipIndex)
		return NextResponse.json(
			{ error: "Missing required parameters" },
			{ status: 400 }
		);

	try {
		const command = new UpdateItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: { leagueId: { S: leagueId }, title: { S: title } },
			UpdateExpression: `REMOVE clipDrafts[${query.clipIndex}]`,
		});

		await client.send(command);
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

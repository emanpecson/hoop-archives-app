import { BatchGetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string }> }
) {
	const { leagueId } = await params;
	const clipIds = req.nextUrl.searchParams.getAll("clipIds[]");

	if (clipIds.length === 0) {
		return NextResponse.json(
			{ error: "Missing params: clipIds[]" },
			{ status: 400 }
		);
	}

	try {
		const keys = clipIds.map((clipId) => ({
			leagueId: { S: leagueId },
			clipId: { S: clipId },
		}));

		const command = new BatchGetItemCommand({
			RequestItems: { Clips: { Keys: keys } },
		});

		const res = await client.send(command);
		const items = res.Responses?.Clips;
		return NextResponse.json(
			items ? items.map((item) => unmarshall(item)) : [],
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

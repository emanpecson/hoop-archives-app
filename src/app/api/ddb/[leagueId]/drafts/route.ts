import { Player } from "@/types/model/player";
import {
	AttributeValue,
	DynamoDBClient,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { Draft } from "@/types/model/draft";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string }> }
) {
	const { leagueId } = await params;
	const draft: Draft = await req.json();
	console.log("Draft body request:", draft);

	if (!draft) {
		return NextResponse.json(
			{ error: "Missing body request" },
			{ status: 400 }
		);
	}

	const mapPlayersToAttributeValue = (players: Player[]) => ({
		L: players.map((player) => ({
			M: {
				playerId: { S: player.playerId },
				firstName: { S: player.firstName },
				lastName: { S: player.lastName },
				fullName: { S: player.fullName },
				leagueId: { S: leagueId },
			},
		})),
	});

	try {
		const item: Record<string, AttributeValue> = {
			leagueId: { S: leagueId },
			title: { S: draft.title },
			bucketKey: { S: draft.bucketKey },
			date: { S: draft.date },
			type: { S: draft.type },
			clipDrafts: { L: [] },
			home: mapPlayersToAttributeValue(draft.home),
			away: mapPlayersToAttributeValue(draft.away),
		};

		const command = new PutItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Item: item,
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

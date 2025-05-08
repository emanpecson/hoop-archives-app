import { Draft } from "@/types/model/draft";
import { Player } from "@/types/model/player";
import {
	AttributeValue,
	DynamoDBClient,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {}

export async function PUT(req: NextRequest) {
	const draft: Draft = await req.json();
	console.log("Draft body request:", draft);

	const query = { filename: req.nextUrl.searchParams.get("filename") };

	if (!draft) {
		return NextResponse.json(
			{ error: "Missing body request" },
			{ status: 400 }
		);
	}

	if (!query.filename) {
		return NextResponse.json(
			{ error: "Missing query param: filename" },
			{ status: 400 }
		);
	}

	const mapPlayersToAttributeValue = (players: Player[]) => ({
		L: players.map((player) => ({
			M: {
				playerId: { S: player.playerId },
				firstName: { S: player.firstName },
				lastName: { S: player.lastName },
			},
		})),
	});

	const item: Record<string, AttributeValue> = {
		filename: { S: query.filename },
		title: { S: draft.title },
		date: { S: draft.date },
		type: { S: draft.type },
	};

	if (draft.players) item.players = mapPlayersToAttributeValue(draft.players);
	if (draft.team1) item.team1 = mapPlayersToAttributeValue(draft.team1);
	if (draft.team2) item.team2 = mapPlayersToAttributeValue(draft.team2);

	const command = new PutItemCommand({
		TableName: process.env.AWS_DDB_DRAFTS_TABLE,
		Item: item,
	});

	const res = await client.send(command);
	return NextResponse.json(res, { status: 200 });
}

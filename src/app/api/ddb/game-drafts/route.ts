import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Player } from "@/types/model/player";
import {
	AttributeValue,
	DeleteItemCommand,
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { GameDraft } from "@/types/model/game-draft";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {
	const query = { title: req.nextUrl.searchParams.get("title") };

	if (!query.title) {
		return NextResponse.json(
			{ error: "Missing query param: title" },
			{ status: 400 }
		);
	}

	try {
		const command = new GetItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: { title: { S: query.title } },
		});

		const { Item } = await client.send(command);
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

export async function PUT(req: NextRequest) {
	const draft: GameDraft = await req.json();
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
			},
		})),
	});

	try {
		const item: Record<string, AttributeValue> = {
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

export async function DELETE(req: NextRequest) {
	const query = { title: req.nextUrl.searchParams.get("title") };

	if (!query.title) {
		return NextResponse.json(
			{ error: "Missing query param: title" },
			{ status: 400 }
		);
	}

	try {
		const command = new DeleteItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: {
				title: {
					S: query.title,
				},
			},
		});

		await client.send(command);
		return NextResponse.json(null, { status: 204 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

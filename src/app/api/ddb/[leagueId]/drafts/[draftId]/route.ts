import {
	DeleteItemCommand,
	DynamoDBClient,
	GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; draftId: string }> }
) {
	const { leagueId, draftId } = await params;

	try {
		const command = new GetItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
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

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; draftId: string }> }
) {
	const { leagueId, draftId } = await params;

	try {
		const command = new DeleteItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: { leagueId: { S: leagueId }, draftId: { S: draftId } },
		});

		await client.send(command);
		return NextResponse.json(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

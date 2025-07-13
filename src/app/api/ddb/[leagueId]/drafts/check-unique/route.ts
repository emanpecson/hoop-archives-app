import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { CheckUniqueTitleResponse } from "@/types/api/check-unique-title";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string }> }
) {
	const { leagueId } = await params;
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
			Key: { leagueId: { S: leagueId }, title: { S: query.title } },
			ProjectionExpression: "title",
		});

		const { Item } = await client.send(command);
		console.log("title?", Item);
		return NextResponse.json(
			{ titleExists: !!Item } as CheckUniqueTitleResponse,
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Server error: " + error },
			{ status: 500 }
		);
	}
}

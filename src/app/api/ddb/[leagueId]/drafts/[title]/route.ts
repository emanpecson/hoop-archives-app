import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string; title: string }> }
) {
	const { leagueId, title } = await params;

	try {
		const command = new GetItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: { leagueId: { S: leagueId }, title: { S: title } },
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

// export async function DELETE(
// 	req: NextRequest,
// 	{ params }: Promise<{ params: { leagueId: string }> }
// ) {
//  const { leagueId } = await params;
// 	const query = { title: req.nextUrl.searchParams.get("title") };

// 	if (!query.title) {
// 		return NextResponse.json(
// 			{ error: "Missing query param: title" },
// 			{ status: 400 }
// 		);
// 	}

// 	try {
// 		const command = new DeleteItemCommand({
// 			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
// 			Key: { leagueId: { S: leagueId }, title: { S: query.title } },
// 		});

// 		await client.send(command);
// 		return NextResponse.json(null, { status: 204 });
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Server error: " + error },
// 			{ status: 500 }
// 		);
// 	}
// }

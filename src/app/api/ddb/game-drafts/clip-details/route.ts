import { ClipDetails } from "@/types/clip-details";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
	const query = { title: req.nextUrl.searchParams.get("title") };
	const clipDetails: ClipDetails = await req.json();

	if (!query.title)
		return NextResponse.json(
			{ error: "Missing required param: title" },
			{ status: 400 }
		);

	if (!clipDetails)
		return NextResponse.json(
			{ error: "Missing body request" },
			{ status: 400 }
		);

	try {
		const command = new UpdateItemCommand({
			TableName: process.env.AWS_DDB_DRAFTS_TABLE,
			Key: {
				title: { S: query.title },
			},
			UpdateExpression:
				"SET clipsDetails = list_append(if_not_exists(clipsDetails, :empty), :cd)",
			ExpressionAttributeValues: marshall({
				":cd": [clipDetails], // wrap in array to append
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

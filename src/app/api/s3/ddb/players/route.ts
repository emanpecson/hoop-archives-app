import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	ScanCommand,
	DynamoDBDocumentClient,
	ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req: NextRequest) {
	const query = {
		exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
		search: req.nextUrl.searchParams.get("search"),
	};

	const params: ScanCommandInput = {
		TableName: process.env.AWS_DDB_PLAYERS_TABLE,
		Limit: 4, // items per page
		ExclusiveStartKey:
			query.exclusiveStartKey !== "undefined"
				? JSON.parse(query.exclusiveStartKey as string)
				: undefined,
	};

	// filter by first/last name
	if (query.search) {
		params.FilterExpression =
			"begins_with(#firstName, :q) OR begins_with(#lastName, :q)";
		params.ExpressionAttributeNames = {
			"#firstName": "firstName",
			"#lastName": "lastName",
		};
		params.ExpressionAttributeValues = {
			":q": query.search,
		};
	}

	try {
		const { Items, LastEvaluatedKey } = await docClient.send(
			new ScanCommand(params)
		);

		return NextResponse.json({ Items, LastEvaluatedKey }, { status: 200 });
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

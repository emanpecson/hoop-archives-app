import processExclusiveStartKey from "@/utils/server/process-exclusive-start-key";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	ScanCommand,
	DynamoDBDocumentClient,
	ScanCommandInput,
	QueryCommandInput,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req: NextRequest) {
	const query = {
		exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
		search: req.nextUrl.searchParams.get("search"),
	};

	if (!query.exclusiveStartKey) {
		return NextResponse.json(
			{ error: "Missing query parameter: exclusiveStartKey" },
			{ status: 400 }
		);
	}

	try {
		// if query provided, search entire table by first name via gsi
		// note: query must match exactly
		if (query.search) {
			const params: QueryCommandInput = {
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				IndexName: "FirstNameIndex",
				KeyConditionExpression: "#firstName = :firstName",
				ExpressionAttributeNames: { "#firstName": "firstName" },
				ExpressionAttributeValues: { ":firstName": query.search },
				Limit: 4,
				ExclusiveStartKey: processExclusiveStartKey(query.exclusiveStartKey),
			};

			const { Items, LastEvaluatedKey } = await docClient.send(
				new QueryCommand(params)
			);
			return NextResponse.json({ Items, LastEvaluatedKey }, { status: 200 });
		}

		// get data w/o search query
		else {
			const params: ScanCommandInput = {
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				Limit: 4,
				ExclusiveStartKey: processExclusiveStartKey(query.exclusiveStartKey),
			};

			const { Items, LastEvaluatedKey } = await docClient.send(
				new ScanCommand(params)
			);
			return NextResponse.json({ Items, LastEvaluatedKey }, { status: 200 });
		}
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

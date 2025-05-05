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

const getExclusiveStartKey = (keyQuery: string) => {
	if (keyQuery !== "undefined") {
		return JSON.parse(keyQuery);
	} else {
		return undefined;
	}
};

export async function GET(req: NextRequest) {
	const query = {
		exclusiveStartKey: req.nextUrl.searchParams.get("exclusiveStartKey"),
		search: req.nextUrl.searchParams.get("search"),
	};

	try {
		if (query.search) {
			const params: QueryCommandInput = {
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				IndexName: "FirstNameIndex",
				KeyConditionExpression: "#firstName = :firstName",
				ExpressionAttributeNames: { "#firstName": "firstName" },
				ExpressionAttributeValues: { ":firstName": query.search },
				Limit: 4,
				ExclusiveStartKey: getExclusiveStartKey(
					query.exclusiveStartKey as string
				),
			};

			console.log("params:", params);

			const { Items, LastEvaluatedKey } = await docClient.send(
				new QueryCommand(params)
			);
			return NextResponse.json({ Items, LastEvaluatedKey }, { status: 200 });
		} else {
			const params: ScanCommandInput = {
				TableName: process.env.AWS_DDB_PLAYERS_TABLE,
				Limit: 4,
				ExclusiveStartKey: getExclusiveStartKey(
					query.exclusiveStartKey as string
				),
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

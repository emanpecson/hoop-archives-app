import { Clip } from "@/types/model/clip";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	QueryCommand,
	QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const filterClips = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items: Record<string, any>[] | undefined,
	query: URLSearchParams
) => {
	let clips = items as Clip[];

	const filters = {
		play: query.get("play"),
		tags: query.getAll("tags[]"),
		clipIds: query.getAll("clipIds[]"),
		dateStart: query.get("dateStart"),
		dateEnd: query.get("dateEnd"),

		// * offense filters
		playerScoringId: query.get("playerScoringId"),
		playerAssistingId: query.get("playerAssistingId"),
		playersDefendingIds: query.getAll("playersDefendingIds[]"),

		// * defense filters
		playerDefendingId: query.get("playerDefendingId"),
		playerStoppedId: query.get("playerStoppedId"),
	};

	if (filters.clipIds && filters.clipIds.length > 0) {
		clips = clips.filter((clip) => filters.clipIds.includes(clip.clipId));
	}

	// filter clips that have at least one of the filtered tags
	if (filters.tags && filters.tags.length > 0) {
		clips = clips.filter((clip) =>
			clip.tags.some((tag) => filters.tags.includes(tag))
		);
	}

	// filter by dates
	const start = filters.dateStart;
	const end = filters.dateEnd;

	if (start) {
		clips = clips.filter((clip) => new Date(start) <= new Date(clip.date));
	}
	if (end) {
		clips = clips.filter((clip) => new Date(clip.date) <= new Date(end));
	}

	// filter offensive clips
	if (filters.play === "offense") {
		clips = clips.filter((clip) => !!clip.offense);

		if (filters.playerScoringId) {
			clips = clips.filter(
				(clip) =>
					clip.offense!.playerScoring.playerId === filters.playerScoringId
			);
		}
		if (filters.playerAssistingId) {
			clips = clips.filter((clip) => {
				const assister = clip.offense!.playerAssisting;
				if (assister) return assister.playerId === filters.playerAssistingId;
				return false;
			});
		}
		if (filters.playersDefendingIds && filters.playersDefendingIds.length > 0) {
			clips = clips.filter((clip) => {
				const defenders = clip.offense!.playersDefending;
				if (defenders && defenders.length > 0) {
					return defenders.some((def) =>
						filters.playersDefendingIds.includes(def.playerId)
					);
				}
				return false;
			});
		}
	}

	// filter defensive clips
	else if (filters.play === "defense") {
		clips = clips.filter((clip) => !!clip.defense);

		if (filters.playerDefendingId) {
			clips = clips.filter(
				(clip) =>
					clip.defense!.playerDefending.playerId === filters.playerDefendingId
			);
		}
		if (filters.playerStoppedId) {
			clips = clips.filter(
				(clip) =>
					clip.defense!.playerStopped.playerId === filters.playerStoppedId
			);
		}
	}

	return clips;
};

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ leagueId: string }> }
) {
	const { leagueId } = await params;
	const query = req.nextUrl.searchParams;

	try {
		const queryInput: QueryCommandInput = {
			TableName: process.env.AWS_DDB_CLIPS_TABLE,
			KeyConditionExpression: "leagueId = :leagueId",
			ExpressionAttributeValues: { ":leagueId": leagueId },
		};

		const { Items } = await docClient.send(new QueryCommand(queryInput));
		const filteredClips = filterClips(Items, query);

		return NextResponse.json(filteredClips, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

import { apiHandler, AwsClient } from "@/utils/server/api-handler";
// import { DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  GetCommand,
  QueryCommandInput,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  leagueId: string;
  gameId: string;
};

export const GET = apiHandler<Context>(
  async (_req: NextRequest, ctx: Context, aws: AwsClient) => {
    const { leagueId, gameId } = ctx;

    try {
      const command = new GetCommand({
        TableName: process.env.AWS_DDB_GAMES_TABLE,
        Key: { leagueId, gameId },
      });

      const { Item } = await aws.ddbDoc.send(command);
      if (!Item) {
        return NextResponse.json(
          { error: "Could not retrieve item" },
          { status: 500 }
        );
      }

      return NextResponse.json(Item, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
);

export const DELETE = apiHandler<Context>(
  async (_req: NextRequest, ctx: Context, aws: AwsClient) => {
    try {
      const { leagueId, gameId } = ctx;

      console.log("Reached the delete api route");

      // get access to clips
      const queryInput: QueryCommandInput = {
        TableName: process.env.AWS_DDB_CLIPS_TABLE,
        IndexName: process.env.AWS_DDB_CLIPS_GSI_GAME_ID,
        KeyConditionExpression: "leagueId = :leagueId AND gameId = :gameId",
        ExpressionAttributeValues: { ":gameId": gameId, ":leagueId": leagueId },
      };

      const { Items: clips } = await aws.ddbDoc.send(
        new QueryCommand(queryInput)
      );

      console.log("clips:", clips);

      if (clips) {
        for (const clip of clips) {
          // delete s3 clip
          const s3ClipDeleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: String(clip.bucketKey),
          });

          const s3Res = await aws.s3.send(s3ClipDeleteCommand);
          console.log("S3 clip deletion response:", s3Res);

          // delete ddb clip
          const ddbClipDeleteCommand = new DeleteCommand({
            TableName: process.env.AWS_DDB_CLIPS_TABLE,
            Key: { leagueId, clipId: clip.clipId },
          });

          const ddbRes = await aws.ddbDoc.send(ddbClipDeleteCommand);
          console.log("Ddb clip deleteion response:", ddbRes);
        }
      }

      // delete combined-game s3 video: combined_{gameId}.mp4
      const gameBucketKey = "combined_" + gameId + ".mp4";
      const s3GameDeleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: String(gameBucketKey),
      });

      const s3Res = await aws.s3.send(s3GameDeleteCommand);
      console.log("S3 game deletion response:", s3Res);

      // delete ddb game
      const ddbGameDeleteCommand = new DeleteCommand({
        TableName: process.env.AWS_DDB_GAMES_TABLE,
        Key: { leagueId, gameId },
      });

      const ddbRes = await aws.ddbDoc.send(ddbGameDeleteCommand);
      console.log("Ddb game deleteion response:", ddbRes);

      console.log("Reached the end");
      return NextResponse.json(null, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
);

import { Game } from "@/types/model/game";
import GamePreviewDialog from "./game-preview-dialog";
import Image from "next/image";
import { UploadStatus } from "@/types/enum/upload-status";
import { Loader2Icon } from "lucide-react";

interface GamePreviewMobileProps {
  game: Game;
  onDelete: () => void;
}
export default function GamePreviewMobile({
  game,
  onDelete,
}: GamePreviewMobileProps) {
  const url =
    game.status === UploadStatus.COMPLETE
      ? `/league/${game.leagueId}/game/${game.gameId}`
      : undefined;

  return (
    <GamePreviewDialog game={game} onDelete={onDelete}>
      {game.thumbnailUrl && url ? (
        <Image
          src={game.thumbnailUrl}
          alt={`${game.title} thumbnail`}
          width={80}
          height={40}
          className="w-full h-40 object-cover rounded-none"
          unoptimized
        />
      ) : (
        <div className="w-80 h-40 rounded-lg bg-neutral-700/50 flex justify-center place-items-center pointer-events-none">
          {game.status === UploadStatus.UPLOADING ? (
            <Loader2Icon className="animate-spin text-neutral-500/50" />
          ) : (
            <p className="text-neutral-500/50">Unavailable</p>
          )}
        </div>
      )}
    </GamePreviewDialog>
  );
}

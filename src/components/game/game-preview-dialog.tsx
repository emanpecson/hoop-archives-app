"use client";

import { Game } from "@/types/model/game";
import Statboard from "../video-clipper/game-details/statboard";
import { useLoadData } from "@/hooks/use-load-data";
import { useState } from "react";
import { Clip } from "@/types/model/clip";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogDivider,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { tempLeagueId } from "@/data/temp";
import ConfirmDialog from "../confirm-dialog";
import { useSession } from "next-auth/react";
import useRoleCheck from "@/hooks/use-role-check";
import LoadingPrompt from "../loading-prompt";
import EmptyPrompt from "../empty-prompt";

interface GamePreviewDialogProps {
  game: Game;
  children: React.ReactNode;
}

export default function GamePreviewDialog(props: GamePreviewDialogProps) {
  const [clips, setClips] = useState<Clip[]>([]);
  const [isFetchingClips, setIsFetchingClips] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const gameUrl = `/league/${props.game.leagueId}/game/${props.game.gameId}`;

  // access session variable for role access control
  const { data: session } = useSession();
  const { isBetaUser } = useRoleCheck(session);

  useLoadData({
    endpoint: `/api/ddb/${tempLeagueId}/clips/${props.game.gameId}`,
    onDataLoaded: setClips,
    setIsLoading: setIsFetchingClips,
    onError: () => toast.error("Error fetching game clips"),
  });

  const deleteGame = async () => {
    console.log("placeholder: delete game");

    try {
      setDeleting(true);

      const res = await fetch(
        `/api/ddb/${tempLeagueId}/games/${props.game.gameId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success(`Successfully deleted ${props.game.title}`);
      } else {
        toast.error(`Failed to delete ${props.game.title}`);
      }
    } catch (error) {
      toast.error(`Error deleting ${props.game.title}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{props.game.title}</DialogTitle>
          <DialogDescription>View game details</DialogDescription>
        </DialogHeader>

        <DialogDivider />

        <div>
          {isFetchingClips ? (
            <LoadingPrompt text="Loading data" />
          ) : clips && clips.length > 0 ? (
            <div className="flex place-items-center justify-between space-x-20">
              <Statboard
                label="Home Stats"
                players={props.game.home}
                clips={clips}
              />
              <Statboard
                label="Away Stats"
                players={props.game.away}
                clips={clips}
              />
            </div>
          ) : (
            <EmptyPrompt text="No data" />
          )}
        </div>

        {clips.length > 0 && (
          <>
            <DialogDivider />

            <DialogFooter className="w-full flex justify-end">
              <Button variant="outline">
                <Link href={gameUrl}>Watch game</Link>
              </Button>

              {!isBetaUser() && (
                <ConfirmDialog
                  onConfirm={deleteGame}
                  title="Confirm Game Deletion"
                  description={`Are you sure you want to delete ${props.game.title}? This cannot be undone.`}
                  loading={deleting}
                  confirmPrompt="Delete"
                >
                  <Button variant="outline">Delete</Button>
                </ConfirmDialog>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

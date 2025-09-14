"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Player } from "@/types/model/player";
import { useState } from "react";
import { toast } from "sonner";
import PlayerCard from "./player-card";
import LoadingPrompt from "../loading-prompt";
import EmptyPrompt from "../empty-prompt";
import { Button } from "../ui/button";
import NewPlayerDialog from "../new-player/new-player-dialog";
import { useSession } from "next-auth/react";
import useRoleCheck from "@/hooks/use-role-check";

interface PlayerCollectionProps {
  leagueId: string;
}

export default function PlayerCollection(props: PlayerCollectionProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerDialogOpen, setNewPlayerDialogOpen] = useState(false);

  const { data: session } = useSession();
  const { isBetaUser } = useRoleCheck(session);

  useLoadData({
    endpoint: `/api/ddb/${props.leagueId}/players`,
    onDataLoaded: setPlayers,
    setIsLoading,
    onError: () => toast.error("Error fetching players"),
  });

  return (
    <>
      <div className="w-full h-full flex-col space-y-4">
        <div className="flex justify-end">
          {!isBetaUser() && (
            <Button
              variant="input"
              className="w-fit"
              onClick={() => setNewPlayerDialogOpen(true)}
            >
              New player
            </Button>
          )}
        </div>

        <div>
          {isLoading ? (
            <LoadingPrompt text="Loading players. Please wait..." />
          ) : players.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-8 justify-center">
              {players.map((player, i) => (
                <PlayerCard player={player} key={i} />
              ))}
            </div>
          ) : (
            <EmptyPrompt text="No players" goBackUrl="/" />
          )}
        </div>
      </div>

      <NewPlayerDialog
        open={newPlayerDialogOpen}
        setOpen={setNewPlayerDialogOpen}
      />
    </>
  );
}

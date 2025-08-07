"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { useState } from "react";
import { toast } from "sonner";
import { tempLeagueId } from "@/data/temp";
import LoadingPrompt from "@/components/loading-prompt";
import EmptyPrompt from "@/components/empty-prompt";
import ReelPlayer from "@/components/media/reel-player";
import { Reel } from "@/types/model/reel";

interface ReelOverviewProps {
	leagueId: string;
	reelId: string;
}

export default function ReelOverview({ leagueId, reelId }: ReelOverviewProps) {
	const [isFetchingGame, setIsFetchingGame] = useState(true);
	const [reel, setReel] = useState<Reel | null>(null);

	useLoadData({
		endpoint: `/api/ddb/${leagueId}/reels/${reelId}`,
		onDataLoaded: setReel,
		setIsLoading: setIsFetchingGame,
		onError: () => toast.error("Error fetching game"),
	});

	return (
		<div className="w-full h-full">
			{isFetchingGame ? (
				<LoadingPrompt
					text={`Loading "${reelId}". Please wait...`}
					goBackUrl={`/league/${tempLeagueId}`}
				/>
			) : reel && reel.sourceUrl ? (
				<div className="flex h-full gap-2">
					<ReelPlayer src={reel.sourceUrl} />
				</div>
			) : (
				<EmptyPrompt
					text={`Failed to load "${reelId}"`}
					goBackUrl={`/league/${tempLeagueId}`}
				/>
			)}
		</div>
	);
}

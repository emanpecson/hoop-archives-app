"use client";

import { useEffect, useState } from "react";
import HighlightFilterDialog from "./highlight-builder-dialog";
import { GameClip } from "@/types/model/game-clip";
import { toast } from "sonner";

interface HighlightBuilderProps {
	leagueId: string;
}

export default function HighlightBuilder(props: HighlightBuilderProps) {
	const [open, setOpen] = useState(false);
	const [clips, setClips] = useState<GameClip[]>([]);
	const [isFetchingClips, setIsFetchingClips] = useState(false);
	const [queries, setQueries] = useState<string[]>([]);
	// const [selectedClipIds, setSelectedClipIds] = useState<string[]>([]);

	useEffect(() => {
		const fetchClips = async () => {
			try {
				setIsFetchingClips(true);

				const queryString = queries.join("&");
				const url = `/api/ddb/${props.leagueId}/game-clips?${queryString}`;

				const res = await fetch(url);
				const data = await res.json();

				setClips(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				toast.error("Error fetching clips");
			} finally {
				setIsFetchingClips(false);
			}
		};
		fetchClips();
	}, [props.leagueId, queries]);

	return (
		<div className="flex flex-col space-y-8">
			<button onClick={() => setOpen(true)}>open dialog</button>
			<HighlightFilterDialog
				leagueId={props.leagueId}
				open={open}
				setOpen={setOpen}
				onSubmit={setQueries}
			/>

			<div>{JSON.stringify(queries)}</div>
			<div>{`/api/ddb/${props.leagueId}/game-clips?${queries.join("&")}`}</div>

			{isFetchingClips ? (
				<p>Loading clips...</p>
			) : clips && clips.length > 0 ? (
				<div>{JSON.stringify(clips)}</div>
			) : (
				<p>no clips</p>
			)}
		</div>
	);
}

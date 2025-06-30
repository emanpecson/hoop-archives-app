"use client";

import { GameClip } from "@/types/model/game-clip";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface HighlightsViewProps {
	leagueId: string;
}

export default function HighlightsView(props: HighlightsViewProps) {
	const searchParams = useSearchParams();

	const [clips, setClips] = useState<GameClip[]>([]);
	const [isFetchingClips, setIsFetchingClips] = useState(true);

	useEffect(() => {
		const fetchClips = async () => {
			const params = new URLSearchParams(searchParams.toString());
			params.append("leagueId", props.leagueId);

			const url = `/api/ddb/${props.leagueId}/game-clips?${params.toString()}`;
			const res = await fetch(url);
			const data = await res.json();
			console.log("data:", data);
		};
		fetchClips();
	}, []);

	return <div>this is a test</div>;
}

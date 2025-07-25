"use client";

import { Clip } from "@/types/model/clip";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ClipPlayer from "../clip-player";

interface HighlightsViewProps {
	leagueId: string;
}

export default function HighlightsView(props: HighlightsViewProps) {
	const params = useSearchParams();
	const [clips, setClips] = useState<Clip[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		const fetchClips = async () => {
			try {
				setIsFetching(true);
				const res = await fetch(
					`/api/ddb/${props.leagueId}/clips/highlights?${params.toString()}`
				);
				const data = await res.json();
				setClips(data);
			} catch (error) {
				console.log(error);
				toast.error("Failed to fetch clips");
			} finally {
				setIsFetching(false);
			}
		};

		fetchClips();
	}, [params, props.leagueId]);

	return (
		<div className="h-full">
			{isFetching ? (
				<p>fetching clips</p>
			) : (
				<ClipPlayer clips={clips} hideScore />
			)}
		</div>
	);
}

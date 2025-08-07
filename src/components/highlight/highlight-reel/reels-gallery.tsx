"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tempLeagueId } from "@/data/temp";
import LoadingPrompt from "@/components/loading-prompt";
import { Reel } from "@/types/model/reel";
import {
	PaginatedReelsResponse,
	ReelPrimaryKey,
} from "@/types/api/paginated-reels";
import EmptyPrompt from "@/components/empty-prompt";
import Pagination from "@/components/pagination";
import ReelPreview from "./reel-preview";

interface ReelsGalleryProps {
	leagueId: string;
	title: string | undefined;
}

export default function ReelsGallery(props: ReelsGalleryProps) {
	const [reels, setReels] = useState<Reel[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [page, setPage] = useState(0);
	const [pageKeys, setPageKeys] = useState<(ReelPrimaryKey | undefined)[]>([
		undefined,
	]);

	const fetchReels = async (key: ReelPrimaryKey | undefined) => {
		try {
			setIsFetching(true);
			const res = await fetch(
				`/api/ddb/${
					props.leagueId
				}/reels?exclusiveStartKey=${encodeURIComponent(
					JSON.stringify(key)
				)}&title=${props.title}`
			);

			const { reels, lastEvaluatedKey }: PaginatedReelsResponse =
				await res.json();

			setReels(reels);
			setPageKeys((prevKeys) => {
				// case 1: if we're at the last item, append to end
				if (page === prevKeys.length - 1) {
					return [...prevKeys, lastEvaluatedKey];
				}

				// case 2: the next key should overwrite at an existing index
				else {
					const newKeys = [...prevKeys];
					newKeys[page + 1] = lastEvaluatedKey;
					return newKeys;
				}
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error("Could not fetch games");
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		fetchReels(pageKeys[page]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, props]);

	return (
		<div className="w-full">
			{isFetching ? (
				<LoadingPrompt
					text={`Loading clips. Please wait...`}
					goBackUrl={`/league/${tempLeagueId}`}
				/>
			) : reels && reels.length > 0 ? (
				<div className="w-full space-y-4">
					{/* games */}
					<div className="grid grid-cols-4 gap-3">
						{reels.map((reel, i) => (
							<ReelPreview reel={reel} key={i} />
						))}
					</div>

					<Pagination
						onPrevious={() => setPage(page - 1)}
						previousDisabled={page === 0}
						onNext={() => setPage(page + 1)}
						nextDisabled={!pageKeys[page + 1]}
					/>
				</div>
			) : (
				<EmptyPrompt text="No reels to display" />
			)}
		</div>
	);
}

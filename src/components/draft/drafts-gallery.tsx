"use client";

import {
	DraftPrimaryKey,
	PaginatedDraftsResponse,
} from "@/types/api/paginated-drafts";
import { Draft } from "@/types/model/draft";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingPrompt from "../loading-prompt";
import Pagination from "../pagination";
import EmptyPrompt from "../empty-prompt";
import DraftPreview from "./draft-preview";

interface DraftsGalleryProps {
	leagueId: string;
}

export default function DraftsGallery(props: DraftsGalleryProps) {
	const [drafts, setDrafts] = useState<Draft[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [page, setPage] = useState(0);
	const [pageKeys, setPageKeys] = useState<(DraftPrimaryKey | undefined)[]>([
		undefined,
	]);

	const handleDelete = (index: number) => {
		setDrafts((prevDrafts) => {
			const updatedDrafts = [...prevDrafts];
			updatedDrafts.splice(index);
			return updatedDrafts;
		});
	};

	const fetchDrafts = async (key: DraftPrimaryKey | undefined) => {
		try {
			const res = await fetch(
				`/api/ddb/${
					props.leagueId
				}/drafts?exclusiveStartKey=${encodeURIComponent(JSON.stringify(key))}`
			);
			const { drafts, lastEvaluatedKey }: PaginatedDraftsResponse =
				await res.json();

			setDrafts(drafts);
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
			toast.error("Failed to fetch drafts");
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		fetchDrafts(pageKeys[page]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, props]);

	return (
		<div className="w-full">
			{isFetching ? (
				<LoadingPrompt text="Loading Drafts" />
			) : drafts && drafts.length > 0 ? (
				<div className="w-full space-y-4">
					{/* drafts */}
					<div className="grid grid-cols-4 gap-3">
						{drafts.map((draft, i) => (
							<DraftPreview
								leagueId={props.leagueId}
								draft={draft}
								key={i}
								onDelete={() => handleDelete(i)}
							/>
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
				<EmptyPrompt text="No drafts to display" />
			)}
		</div>
	);
}

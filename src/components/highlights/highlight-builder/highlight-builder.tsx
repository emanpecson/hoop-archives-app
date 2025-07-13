"use client";

import { useEffect, useState } from "react";
import HighlightFilterDialog from "./highlight-builder-dialog";
import { Clip } from "@/types/model/clip";
import { toast } from "sonner";
import ClipPlayer from "@/components/clip-player";
import HighlightClipTable from "@/components/highlights/highlight-clip-table/highlight-clip-table";
import HighlightClipManager from "@/components/highlights/highlight-builder/highlight-clip-manager";
import { HighlightsFormFields } from "@/types/schema/highlights-schema";

interface HighlightBuilderProps {
	leagueId: string;
}

export default function HighlightBuilder(props: HighlightBuilderProps) {
	const [open, setOpen] = useState(false);
	const [clips, setClips] = useState<Clip[]>([]);
	const [isFetchingClips, setIsFetchingClips] = useState(false);
	const [filters, setFilters] = useState<string[]>([]);
	const [filtersForm, setFiltersForm] = useState<HighlightsFormFields | null>(
		null
	);
	const [activeClipId, setActiveClipId] = useState<string | null>(null);
	const [selectedClips, setSelectedClips] = useState<Clip[]>([]);

	const handleAddFilters = (filters: string[], form: HighlightsFormFields) => {
		setFilters(filters);
		setFiltersForm(form);
		setSelectedClips([]);
	};

	useEffect(() => {
		const fetchClips = async () => {
			try {
				setIsFetchingClips(true);

				const queryString = filters.join("&");
				const url = `/api/ddb/${props.leagueId}/clips?${queryString}`;

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
	}, [props.leagueId, filters]);

	return (
		<>
			<div className="flex flex-col space-y-8 h-full">
				<div className="flex h-full min-h-0 gap-2">
					<div className="w-full flex flex-col gap-2">
						<div className="h-2/3">
							<ClipPlayer
								clips={selectedClips}
								hideScore
								onClipPlaying={setActiveClipId}
							/>
						</div>
						<HighlightClipTable
							clips={clips}
							isLoading={isFetchingClips}
							activeClipId={activeClipId}
							selectedClips={selectedClips}
							setSelectedClips={setSelectedClips}
						/>
					</div>

					<HighlightClipManager
						activeClipId={activeClipId}
						leagueId={props.leagueId}
						selectedClips={selectedClips}
						setSelectedClips={setSelectedClips}
						onAddFiltersOpen={setOpen}
					/>
				</div>
			</div>
			)
			<HighlightFilterDialog
				leagueId={props.leagueId}
				defaultFields={filtersForm}
				open={open}
				setOpen={setOpen}
				onSubmit={handleAddFilters}
			/>
		</>
	);
}

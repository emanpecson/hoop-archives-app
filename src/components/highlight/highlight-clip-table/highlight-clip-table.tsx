import { Clip } from "@/types/model/clip";
import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "../../ui/checkbox";
import DashboardCard from "../../dashboard/dashboard-card";
import HighlightClipRow from "./highlight-clip-row";
import HighlightClipRowSkeleton from "./highlight-clip-row-skeleton";
import { cn } from "@/lib/utils";
import EmptyPrompt from "@/components/empty-prompt";

interface HighlightClipTableProps {
	clips: Clip[];
	isLoading: boolean;
	activeClipId: string | null;
	selectedClips: Clip[];
	setSelectedClips: Dispatch<SetStateAction<Clip[]>>;
}

export default function HighlightClipTable(props: HighlightClipTableProps) {
	const headers = ["id", "date", "length", "tags", "players", ""];

	const selectAll = (checked: boolean) => {
		if (checked) {
			props.setSelectedClips(props.clips);
		} else {
			props.setSelectedClips([]);
		}
	};

	const select = (selectedClip: Clip) => {
		props.setSelectedClips((clips) => {
			if (clips.some((clip) => clip.clipId === selectedClip.clipId))
				return clips.filter((clip) => clip.clipId !== selectedClip.clipId);
			return [...clips, selectedClip];
		});
	};

	return (
		<DashboardCard className="p-0 h-full min-h-0 overflow-y-auto">
			{props.isLoading || props.clips.length > 0 ? (
				<table className="w-full table-fixed">
					<thead>
						<tr className="bg-card-background/50 backdrop-blur-2xl shadow-2xs shadow-input-border sticky top-0 inset-shadow-sm inset-shadow-neutral-800/60">
							<th className="px-4 py-2">
								<div className="flex justify-center place-items-center">
									<Checkbox
										onCheckedChange={selectAll}
										checked={props.clips.length === props.selectedClips.length}
									/>
								</div>
							</th>
							{headers.map((h) => (
								<th
									key={h}
									className="z-10 text-left last:text-right uppercase font-bold text-xs text-neutral-400 px-4 py-2.5"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>

					<tbody
						className={cn(
							props.isLoading ? "overflow-hidden" : "overflow-y-auto",
							"w-full divide-y divide-input-border"
						)}
					>
						{props.isLoading
							? new Array(5)
									.fill(0)
									.map((_, i) => <HighlightClipRowSkeleton key={i} />)
							: props.clips.map((clip, i) => (
									<HighlightClipRow
										key={i}
										index={i}
										activeClipId={props.activeClipId}
										clip={clip}
										onSelect={select}
										selectedClips={props.selectedClips}
									/>
							  ))}
					</tbody>
				</table>
			) : (
				<EmptyPrompt text="No clips" />
			)}
		</DashboardCard>
	);
}

import { Clip } from "@/types/model/clip";
import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "../../ui/checkbox";
import DashboardCard from "../../dashboard/dashboard-card";
import HighlightClipRow from "./highlight-clip-row";
import HighlightClipRowSkeleton from "./highlight-clip-row-skeleton";
import { cn } from "@/lib/utils";

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
		<DashboardCard className="p-0 h-full">
			<table className="w-full">
				<thead>
					<tr>
						<th className="px-4 py-2 border-b border-input-border">
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
								className="text-left last:text-right uppercase font-bold text-xs text-neutral-400 border-b border-input-border px-4 py-2.5"
							>
								{h}
							</th>
						))}
					</tr>
				</thead>

				<tbody
					className={cn(
						props.isLoading ? "overflow-hidden" : "overflow-y-auto",
						"w-full"
					)}
				>
					{props.isLoading ? (
						new Array(5)
							.fill(0)
							.map((_, i) => <HighlightClipRowSkeleton key={i} />)
					) : props.clips.length > 0 ? (
						props.clips.map((clip, i) => (
							<HighlightClipRow
								key={i}
								index={i}
								activeClipId={props.activeClipId}
								clip={clip}
								onSelect={select}
								selectedClips={props.selectedClips}
							/>
						))
					) : (
						<tr>
							<td>No clips</td>
						</tr>
					)}
				</tbody>
			</table>
		</DashboardCard>
	);
}

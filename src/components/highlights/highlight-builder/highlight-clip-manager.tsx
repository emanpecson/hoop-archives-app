import DashboardCard from "@/components/dashboard/dashboard-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clip } from "@/types/model/clip";
import { CircleCheckIcon, FilterIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface HighlightClipManagerProps {
	activeClipId: string | null;
	leagueId: string;
	selectedClips: Clip[];
	setSelectedClips: Dispatch<SetStateAction<Clip[]>>;
	onAddFiltersOpen: (open: boolean) => void;
}

export default function HighlightClipManager(props: HighlightClipManagerProps) {
	const queries = props.selectedClips
		.map((clip) => `clipIds[]=${clip.clipId}`)
		.join("&");
	const highlightsUrl = `/league/${props.leagueId}/highlights?${queries}`;

	const removeClip = (removeClip: Clip) => {
		props.setSelectedClips((clips) =>
			clips.filter((clip) => clip.clipId !== removeClip.clipId)
		);
	};

	return (
		<DashboardCard className="w-[16rem] space-y-4 flex flex-col justify-between h-full">
			<div className="space-y-1 h-full overflow-y-auto ">
				<DashboardCardHeader text="Selected clips" />
				<ul className="space-y-2">
					{props.selectedClips.length > 0 ? (
						props.selectedClips.map((clip, i) => {
							const playing =
								props.activeClipId && props.activeClipId === clip.clipId;
							return (
								<li
									className={cn(
										playing && "bg-blue-500/10 text-blue-400",
										"px-2.5 py-0.5 rounded-lg text-sm flex space-x-2 place-items-center"
									)}
									key={i}
								>
									<Button
										onClick={() => removeClip(clip)}
										variant="ghost"
										size="icon"
										className="rounded-full size-6"
									>
										<XIcon />
									</Button>
									<span>{clip.clipId}</span>
								</li>
							);
						})
					) : (
						<p className="text-neutral-600 text-sm">No selected clips</p>
					)}
				</ul>
			</div>

			<hr className="text-neutral-800" />

			<div className="space-y-2">
				<Button variant="input" onClick={() => props.onAddFiltersOpen(true)}>
					<FilterIcon />
					<span>Filters</span>
				</Button>

				<Button disabled={props.selectedClips.length === 0} variant="input">
					<CircleCheckIcon />
					<Link href={highlightsUrl}>Complete</Link>
				</Button>
			</div>
		</DashboardCard>
	);
}

import { appFeatures } from "@/data/app-features";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import ReplayGames from "./features/replay-games";
import ClipPlays from "./features/clip-plays";
import HighlightReels from "./features/highlight-reels";

interface FeatureSectionProps {
	selectedAppFeature: number;
	setSelectedAppFeature: Dispatch<SetStateAction<number>>;
	demoLeaguePath: string;
}

export default function FeatureSection(props: FeatureSectionProps) {
	return (
		<section className="space-y-2">
			{/* tabs */}
			<div className="flex px-2 lg:space-x-2 lg:justify-start justify-evenly">
				{appFeatures.map((feat, i) => (
					<button
						key={i}
						className={cn(
							"lg:flex gap-2 place-items-center cursor-pointer py-1.5 px-3 rounded-lg duration-300",
							"hover:bg-neutral-700/20 hover:inset-shadow-sm hover:inset-shadow-white/5",
							i === props.selectedAppFeature
								? "text-white/90"
								: "text-neutral-600 hover:text-white/60"
						)}
						onClick={() => props.setSelectedAppFeature(i)}
					>
						<feat.icon size={20} strokeWidth={1.5} className="shrink-0" />
						<span className="sm:text-base text-sm">{feat.label}</span>
					</button>
				))}
			</div>

			{/* main section */}
			<div
				className={cn(
					"rounded-2xl border p-4 inset-shadow-sm font-light h-full relative pb-32",
					"border-neutral-900 inset-shadow-neutral-700/50 bg-[#1D1D1D] text-neutral-400"
				)}
			>
				{props.selectedAppFeature === 0 ? (
					<ClipPlays />
				) : props.selectedAppFeature === 1 ? (
					<ReplayGames />
				) : (
					props.selectedAppFeature === 2 && <HighlightReels />
				)}

				<button className="absolute z-10 -bottom-5 right-16">
					<Link
						href={props.demoLeaguePath}
						className={cn(
							"flex place-items-center space-x-1.5 px-3 py-1.5 rounded-lg duration-300",
							"text-neutral-500 hover:text-highlight",
							"bg-[#252525] hover:bg-highlight/5",
							"inset-shadow-sm inset-shadow-neutral-700/40 hover:inset-shadow-highlight/10"
						)}
					>
						<span className="text-base font-medium">Try the Demo</span>
						<ArrowRightIcon size={16} strokeWidth={2.5} />
					</Link>
				</button>
			</div>
		</section>
	);
}

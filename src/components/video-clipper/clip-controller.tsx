import DashboardCard from "../dashboard/dashboard-card";
import { ClipDetails } from "@/types/clip-details";
import { RefObject } from "react";

interface ClipControllerProps {
	clips: ClipDetails[];
	currentTime: number;
	duration: number;
	videoRef: RefObject<HTMLVideoElement | null>;
	onPreviewClips: (i: number) => void;
}

export default function ClipController(props: ClipControllerProps) {
	const pixelsPerSecond = 48;

	// const sortClips = (clips: ClipDetails[]) => {
	// 	// shallow copy w/ slice (to avoid mutating og array)
	// 	return clips.slice().sort((a, b) => a.startTime - b.endTime);
	// };

	return (
		<DashboardCard className="h-32">
			<div className="flex h-full space-x-4">
				{props.clips.map((clip, i) => (
					<div
						key={i}
						className="rounded-lg border"
						style={{
							width: pixelsPerSecond * (clip.endTime - clip.startTime),
						}}
						onClick={() => props.onPreviewClips(i)}
					>
						{clip.teamBeneficiary}
					</div>
				))}
			</div>
		</DashboardCard>
	);
}

import { RefObject, useState } from "react";
import DashboardCard from "../../dashboard/dashboard-card";
import TimelineWorkspace from "./timeline-workspace";
import { ClipTime } from "@/types/clip-time";
import ClipButton from "./clip-button";
import { Slider } from "@/components/ui/slider";
import { GameDraft } from "@/types/model/game-draft";

interface VideoControllerProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	currentTime: number;
	duration: number;
	draft: GameDraft;
	onSliderChange: (value: number[]) => void;
	onClipTime: (clipTime: ClipTime) => void;
}

export default function VideoController(props: VideoControllerProps) {
	const [zoom, setZoom] = useState(1); // 1x-4x
	const [hangingClipTime, setHangingClipTime] = useState<number | null>(null);

	const handleZoomChange = (value: number[]) => {
		setZoom(value[0]);
	};

	return (
		<div className="flex w-full h-24 gap-dashboard">
			<DashboardCard className="w-32 shrink-0">
				<Slider min={1} max={4} step={1} onValueChange={handleZoomChange} />
			</DashboardCard>

			<DashboardCard className="w-32 shrink-0">
				<ClipButton
					clips={props.draft.clipsDetails}
					currentTime={props.currentTime}
					duration={props.duration}
					hangingClipTime={hangingClipTime}
					setHangingClipTime={setHangingClipTime}
					onClipTime={props.onClipTime}
				/>
			</DashboardCard>

			<TimelineWorkspace
				zoom={zoom}
				currentTime={props.currentTime}
				duration={props.duration}
				onSliderChange={props.onSliderChange}
				clips={props.draft.clipsDetails}
				hangingClipTime={hangingClipTime}
			/>
		</div>
	);
}

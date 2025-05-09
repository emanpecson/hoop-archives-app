import { Dispatch, RefObject, SetStateAction, useState } from "react";
import DashboardCard from "../../dashboard/dashboard-card";
import TimelineWorkspace from "./timeline-workspace";
import { ClipTime } from "@/types/clip-time";
import ClipButton from "./clip-button";
import { Slider } from "@/components/ui/slider";

interface VideoControllerProps {
	clips: ClipTime[];
	videoRef: RefObject<HTMLVideoElement | null>;
	currentTime: number;
	duration: number;
	setClips: Dispatch<SetStateAction<ClipTime[]>>;
	onSliderChange: (value: number[]) => void;
}

export default function VideoController(props: VideoControllerProps) {
	const [zoom, setZoom] = useState(1); // 1x-4x
	const [pendingClipTime, setPendingClipTime] = useState<number | null>(null);

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
					clips={props.clips}
					setClips={props.setClips}
					currentTime={props.currentTime}
					duration={props.duration}
					pendingClipTime={pendingClipTime}
					setPendingClipTime={setPendingClipTime}
				/>
			</DashboardCard>

			<TimelineWorkspace
				zoom={zoom}
				currentTime={props.currentTime}
				duration={props.duration}
				onSliderChange={props.onSliderChange}
				clips={props.clips}
				pendingClipTime={pendingClipTime}
			/>
		</div>
	);
}

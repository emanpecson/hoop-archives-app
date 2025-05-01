import {
	ChangeEvent,
	Dispatch,
	RefObject,
	SetStateAction,
	useState,
} from "react";
import DashboardCard from "../../dashboard/dashboard-card";
import TimelineWorkspace from "./timeline-workspace";
import { ClipTime } from "@/types/clip-time";
import ClipButton from "./clip-button";

interface VideoControllerProps {
	clips: ClipTime[];
	videoRef: RefObject<HTMLVideoElement | null>;
	currentTime: number;
	duration: number;
	setClips: Dispatch<SetStateAction<ClipTime[]>>;
	onSliderChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VideoController(props: VideoControllerProps) {
	const [zoom, setZoom] = useState(1);

	const handleZoomChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setZoom(parseFloat(ev.target.value));
	};

	return (
		<div className="flex w-full h-24 gap-dashboard">
			<DashboardCard className="w-32">
				<input
					type="range"
					min={1}
					step={0.1}
					max={5}
					onChange={handleZoomChange}
				/>
			</DashboardCard>
			<DashboardCard className="w-32">
				<ClipButton
					clips={props.clips}
					setClips={props.setClips}
					currentTime={props.currentTime}
					duration={props.duration}
				/>
			</DashboardCard>
			<DashboardCard className="w-full overflow-x-auto">
				<TimelineWorkspace
					zoom={zoom}
					currentTime={props.currentTime}
					duration={props.duration}
					onSliderChange={props.onSliderChange}
					clips={props.clips}
				/>
			</DashboardCard>
		</div>
	);
}

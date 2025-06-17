import { useState } from "react";
import DashboardCard from "../../dashboard/dashboard-card";
import TimelineWorkspace from "./timeline-workspace";
import { ClipTime } from "@/types/clip-time";
import ClipButton from "./clip-button";
import { Slider } from "@/components/ui/slider";

interface VideoControllerProps {
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
				<div className="pt-2 flex flex-col justify-center space-y-3 mb-2 text-neutral-500 hover:text-white duration-100">
					<label className="font-medium text-center">Zoom</label>
					<Slider min={1} max={4} step={1} onValueChange={handleZoomChange} />
				</div>
			</DashboardCard>

			<DashboardCard className="w-32 shrink-0">
				<ClipButton
					hangingClipTime={hangingClipTime}
					setHangingClipTime={setHangingClipTime}
					onClipTime={props.onClipTime}
				/>
			</DashboardCard>

			<TimelineWorkspace zoom={zoom} hangingClipTime={hangingClipTime} />
		</div>
	);
}

import { RefObject } from "react";
import VideoOverlayWrapper from "./video-overlay-wrapper";
import { PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";
import { getTimestamp } from "@/utils/time";

interface VideoOverlayControllerProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	startTime: number; // absolute start
	endTime: number; // absolute end
	currentTime: number;
}

export default function VideoOverlayController(
	props: VideoOverlayControllerProps
) {
	const relativeCurrentTime = props.currentTime - props.startTime;
	const relativeEndTime = props.endTime - props.startTime;

	const timestamps = `${getTimestamp(relativeCurrentTime)} / ${getTimestamp(
		relativeEndTime
	)}`;

	const handlePlayPause = () => {
		if (props.videoRef.current) {
			if (props.videoRef.current.paused) props.videoRef.current.play();
			else props.videoRef.current.pause();
		}
	};

	if (props.videoRef.current) {
		return (
			<VideoOverlayWrapper>
				<button
					type="button"
					onClick={handlePlayPause}
					className="cursor-pointer"
				>
					{props.videoRef.current.paused ? (
						<PlayIcon strokeWidth={1.5} />
					) : (
						<PauseIcon strokeWidth={1.5} />
					)}
				</button>
				<span className="pointer-events-none">{timestamps}</span>
				<button type="button">
					<Volume2Icon strokeWidth={1.5} />
				</button>
			</VideoOverlayWrapper>
		);
	}
}

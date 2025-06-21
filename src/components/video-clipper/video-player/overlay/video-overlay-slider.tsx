import { Slider } from "@/components/ui/slider";
import VideoOverlayWrapper from "./video-overlay-wrapper";
import { RefObject } from "react";

interface VideoOverlaySliderProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	startTime: number; // absolute start (i.e. 0:50)
	endTime: number; // absolute end (i.e. 1:02)
	currentTime: number; // absolute current (i.e. 0:55)
	keyframe?: number; // optional: for marking a key frame
}

export default function VideoOverlaySlider(props: VideoOverlaySliderProps) {
	const relativeStartTime = 0;
	const relativeEndTime = props.endTime - props.startTime; // clip duration

	const keyframePosition = props.keyframe
		? ((props.keyframe - props.startTime) / relativeEndTime) * 100
		: 0;

	// position relative to clip constraints (i.e. 0:55 - 0:50 = 0:05)
	const relativeCurrentTime = props.currentTime - props.startTime;

	const handleSliderChange = (value: number[]) => {
		const relativeTime = value[0]; // from 0 -> clip duration

		// convert to absolute time (i.e. 0:50 + @0:05 = @0:55)
		const absoluteTime = props.startTime + relativeTime;

		// update video-thumb position (upon converting to its absolute time)
		if (props.videoRef.current) {
			props.videoRef.current.currentTime = absoluteTime;
		}
	};

	return (
		<VideoOverlayWrapper>
			<div className="relative w-full">
				<Slider
					min={relativeStartTime}
					max={relativeEndTime}
					step={0.1}
					value={[relativeCurrentTime]}
					onValueChange={handleSliderChange}
				/>
				{props.keyframe && (
					<div
						className="absolute h-[3rem] w-1 bg-yellow-400 rounded-md -top-5"
						style={{ left: `${keyframePosition}%` }}
					/>
				)}
			</div>
		</VideoOverlayWrapper>
	);
}

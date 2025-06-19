import { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { getTimestamp } from "@/utils/time";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

interface TimelineWorkspaceProps {
	zoom: number; // magnify rate
	hangingClipTime: number | null;
}

export default function TimelineWorkspace(props: TimelineWorkspaceProps) {
	const { draft, currentTime, setCurrentTime, videoRef, duration } =
		useVideoClipperStore((state) => ({
			draft: state.draft,
			currentTime: state.currentTime,
			setCurrentTime: state.setCurrentTime,
			videoRef: state.videoRef,
			duration: state.duration,
		}));

	const [timestamps, setTimestamps] = useState<number[]>([]);
	const pixelsPerSecond = 48;
	const secondsGap = 2;

	const timelinePixels = duration * pixelsPerSecond * props.zoom;
	const timestampGap = secondsGap / props.zoom;

	useEffect(() => {
		setTimestamps(() => {
			const newTimestamps: number[] = [];
			for (let second = 0; second <= duration; second += timestampGap) {
				newTimestamps.push(second);
			}
			return newTimestamps;
		});
	}, [timestampGap, duration]);

	/**
	 * Gets the position of where a time exists within the duration
	 * of the video
	 *
	 * i.e. 20s / 100s -> position 20% of the width of the timeline
	 *
	 * @param {number} time
	 * @returns {number} Position of timestamp as a percentage (i.e. returned 20 means 20%)
	 */
	const getTimestampPosition = (time: number): number => {
		return duration > 0 ? (time / duration) * 100 : 0;
	};

	const handleSliderChange = (value: number[]) => {
		setCurrentTime(value[0]);
		if (videoRef.current) videoRef.current.currentTime = value[0];
	};

	return (
		<div className="w-full h-full border border-card-border rounded-2xl relative overflow-x-auto">
			<SliderPrimitive.Root
				data-slot="slider"
				value={[currentTime]}
				onValueChange={handleSliderChange}
				step={0.1}
				min={0}
				max={duration}
				className="absolute flex touch-none items-center select-none h-full bg-card-background inset-shadow-sm inset-shadow-neutral-800/60"
				style={{ width: `${timelinePixels}px` }}
			>
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="rounded-full w-full h-1.5 bg-neutral-700 relative"
				>
					{/* timestamps */}
					<div
						className="top-5 w-full"
						style={{ width: `${100 * props.zoom}%` }}
					>
						{timestamps.map((time, i) => (
							<div
								key={i}
								className="absolute -translate-x-1/2" // offset so that content appears at middle
								style={{ left: `${getTimestampPosition(time)}%` }}
							>
								{getTimestamp(time)}
							</div>
						))}
					</div>
				</SliderPrimitive.Track>

				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					className="bg-white block w-1.5 h-20 shrink-0 rounded-full cursor-pointer pointer-events-auto"
				/>

				{/* clip segments */}
				<div className="absolute top-14 left-0 w-full h-full transform -translate-y-1/2 z-10">
					{draft &&
						draft.clipDrafts.map((clip, i) => (
							<div
								key={i}
								className="absolute -top-2 h-full rounded-lg border-4 border-yellow-400"
								style={{
									left: `${getTimestampPosition(clip.startTime)}%`,
									width: `${
										getTimestampPosition(clip.endTime) -
										getTimestampPosition(clip.startTime)
									}%`,
								}}
							/>
						))}
				</div>

				{/* single marker on pending clip */}
				{props.hangingClipTime && (
					<div
						className="absolute -top-2 bg-yellow-400 h-full w-1 rounded-full"
						style={{
							left: `${getTimestampPosition(props.hangingClipTime)}%`,
						}}
					/>
				)}
			</SliderPrimitive.Root>
		</div>
	);
}

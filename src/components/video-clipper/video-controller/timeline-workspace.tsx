import { ClipTime } from "@/types/clip-time";
import { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { getTimestamp } from "@/utils/time";

interface TimelineWorkspaceProps {
	zoom: number; // magnify rate
	currentTime: number;
	duration: number;
	onSliderChange: (value: number[]) => void;
	clips: ClipTime[];
}

export default function TimelineWorkspace(props: TimelineWorkspaceProps) {
	const [timestamps, setTimestamps] = useState<number[]>([]);
	const pixelsPerSecond = 48;
	const secondsGap = 2;

	const timelinePixels = props.duration * pixelsPerSecond * props.zoom;
	const timestampGap = secondsGap / props.zoom;

	useEffect(() => {
		setTimestamps(() => {
			const newTimestamps: number[] = [];
			for (let second = 0; second <= props.duration; second += timestampGap) {
				newTimestamps.push(second);
			}
			return newTimestamps;
		});
	}, [timestampGap, props.duration]);

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
		return props.duration > 0 ? (time / props.duration) * 100 : 0;
	};

	return (
		<div className="w-full h-full border border-card-border rounded-2xl relative overflow-x-auto">
			<SliderPrimitive.Root
				data-slot="slider"
				value={[props.currentTime]}
				onValueChange={props.onSliderChange}
				step={0.1}
				min={0}
				max={props.duration}
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

				{/* Visual Clip Segments */}
				<div className="absolute top-14 left-0 w-full h-full transform -translate-y-1/2 z-10">
					{props.clips.map((clip, i) =>
						clip.end ? (
							<div
								key={i}
								className="absolute -top-2 h-full rounded-lg border-4 border-yellow-400"
								style={{
									left: `${getTimestampPosition(clip.start)}%`,
									width: `${
										getTimestampPosition(clip.end) -
										getTimestampPosition(clip.start)
									}%`,
								}}
							/>
						) : (
							// If end not set yet, show a vertical marker
							<div
								key={i}
								className="absolute -top-2 bg-yellow-400 h-full w-1 rounded-full"
								style={{
									left: `${getTimestampPosition(clip.start)}%`,
								}}
							/>
						)
					)}
				</div>
			</SliderPrimitive.Root>
		</div>
	);
}

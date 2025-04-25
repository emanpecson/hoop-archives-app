import { ClipTime } from "@/types/clip-time";
import { useEffect, useState } from "react";

interface TimelineProps {
	clips: ClipTime[];
	currentTime: number;
	duration: number;
	onSliderChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Timeline(props: TimelineProps) {
	const markerSpacingSeconds = 5;
	const [timestamps, setTimestamps] = useState<number[]>([]);

	useEffect(() => {
		const newTimestamps: number[] = [];
		for (let t = 0; t <= props.duration; t += markerSpacingSeconds) {
			newTimestamps.push(t);
		}
		setTimestamps(newTimestamps);
	}, [props.duration, markerSpacingSeconds]);

	const [zoom, setZoom] = useState(1); // add input for range 0.5x - 1x - 5x

	const formatTime = (sec: number) => {
		const mins = Math.floor(sec / 60);
		const secs = Math.floor(sec % 60);

		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const calcPercent = (value: number) =>
		props.duration > 0 ? (value / props.duration) * 100 : 0;

	return (
		<div className="w-full overflow-x-auto">
			<div className="relative" style={{ width: `${zoom * 100}%` }}>
				{/* Timeline with clip markers */}
				<input
					type="range"
					min={0}
					max={props.duration}
					step="0.1"
					value={props.currentTime}
					onChange={props.onSliderChange}
					className="w-full z-10"
				/>

				{/* Visual Clip Segments */}
				<div className="absolute top-2.5 left-0 w-full h-[6px] transform -translate-y-1/2 pointer-events-none z-10">
					{props.clips.map((clip, i) =>
						clip.end !== null ? (
							<div
								key={i}
								className="absolute bg-orange-500 h-full rounded"
								style={{
									left: `${calcPercent(clip.start) * zoom}%`,
									width: `${
										(calcPercent(clip.end) - calcPercent(clip.start)) * zoom
									}%`,
								}}
							/>
						) : (
							// If end not set yet, show a vertical marker
							<div
								key={i}
								className="absolute bg-yellow-400 h-full"
								style={{
									left: `${calcPercent(clip.start) * zoom}%`,
									width: "2px",
								}}
							/>
						)
					)}
				</div>

				{/* timestamps */}
				<div
					className="top-full left-0 mt-1 text-xs w-full pointer-events-none h-8"
					style={{ width: `${100 * zoom}%` }}
				>
					{timestamps.map((time, i) => (
						<div
							key={i}
							className="absolute flex flex-col items-center"
							style={{
								left: `${calcPercent(time) * zoom}%`,
								transform: "translateX(-50%)",
							}}
						>
							<div className="w-px h-2 bg-red-500 mb-1" />
							<div>{formatTime(time)}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

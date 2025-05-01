import { ClipTime } from "@/types/clip-time";
import { useEffect, useState } from "react";

interface TimelineWorkspaceProps {
	zoom: number;
	currentTime: number;
	duration: number;
	onSliderChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
	clips: ClipTime[];
}

export default function TimelineWorkspace(props: TimelineWorkspaceProps) {
	const [timestamps, setTimestamps] = useState<number[]>([]);

	const getMarkerSpacing = (duration: number, zoom: number) => {
		const approxVisibleMarkers = 10; // ideal number of markers at current zoom
		const base = duration / (approxVisibleMarkers * zoom);

		// Round to nearest multiple of 5/10/30/60 for readability
		if (base < 10) return 5;
		if (base < 30) return 10;
		if (base < 60) return 30;
		if (base < 180) return 60;
		return 300; // 5 mins
	};

	useEffect(() => {
		const spacing = getMarkerSpacing(props.duration, props.zoom);

		const newTimestamps: number[] = [];
		for (let t = 0; t <= props.duration; t += spacing) {
			newTimestamps.push(t);
		}
		setTimestamps(newTimestamps);
	}, [props.duration, props.zoom]);

	const calcPercent = (value: number) => {
		return props.duration > 0 ? (value / props.duration) * 100 : 0;
	};

	const formatTime = (sec: number) => {
		const mins = Math.floor(sec / 60);
		const secs = Math.floor(sec % 60);

		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="relative" style={{ width: `${props.zoom * 100}%` }}>
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
								left: `${calcPercent(clip.start) * props.zoom}%`,
								width: `${
									(calcPercent(clip.end) - calcPercent(clip.start)) * props.zoom
								}%`,
							}}
						/>
					) : (
						// If end not set yet, show a vertical marker
						<div
							key={i}
							className="absolute bg-yellow-400 h-full"
							style={{
								left: `${calcPercent(clip.start) * props.zoom}%`,
								width: "3px",
							}}
						/>
					)
				)}
			</div>

			{/* timestamps */}
			<div
				className="top-full left-0 mt-1 text-xs w-full pointer-events-none h-8"
				style={{ width: `${100 * props.zoom}%` }}
			>
				{timestamps.map((time, i) => (
					<div
						key={i}
						className="absolute flex flex-col items-center"
						style={{
							left: `${calcPercent(time) * props.zoom}%`,
							transform: "translateX(-50%)",
						}}
					>
						<div className="w-px h-2 bg-red-500 mb-1" />
						<div>{formatTime(time)}</div>
					</div>
				))}
			</div>
		</div>
	);
}

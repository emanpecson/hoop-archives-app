import { ClipTime } from "@/types/clip-time";

interface TimelineProps {
	clips: ClipTime[];
	currentTime: number;
	duration: number;
	onSliderChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Timeline(props: TimelineProps) {
	const calcPercent = (value: number) =>
		props.duration > 0 ? (value / props.duration) * 100 : 0;

	return (
		<div className="relative w-full">
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
								left: `${calcPercent(clip.start)}%`,
								width: `${calcPercent(clip.end) - calcPercent(clip.start)}%`,
							}}
						/>
					) : (
						// If end not set yet, show a vertical marker
						<div
							key={i}
							className="absolute bg-yellow-400 h-full"
							style={{ left: `${calcPercent(clip.start)}%`, width: "2px" }}
						/>
					)
				)}
			</div>
		</div>
	);
}

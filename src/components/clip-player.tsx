import { GameClip } from "@/types/model/game-clip";
import { useEffect, useRef, useState } from "react";
import VideoOverlayWrapper from "./video-clipper/video-player/overlay/video-overlay-wrapper";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PauseIcon,
	PlayIcon,
	Volume2Icon,
} from "lucide-react";
import { useRealtimeScore } from "@/hooks/use-realtime-score";
import { cn } from "@/lib/utils";

interface ClipPlayerProps {
	clips: GameClip[];
	hideScore?: boolean;
	onClipPlaying?: (clipId: string) => void;
}

export default function ClipPlayer(props: ClipPlayerProps) {
	const { clips } = props;
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [showOverlayController, setShowOverlayController] = useState(false);
	const score = useRealtimeScore(clips, currentTime);
	const clipIndex = useRef(0);
	const vid = useRef<HTMLVideoElement>(null);

	const handlePlayPause = () => {
		if (vid.current) {
			if (vid.current.paused) vid.current.play();
			else vid.current.pause();
		}
	};

	const handlePrevClip = () => {
		if (vid.current && clipIndex.current > 0) {
			clipIndex.current -= 1;
			const currClip = clips[clipIndex.current];

			if (currClip) {
				if (props.onClipPlaying) props.onClipPlaying(currClip.clipId);

				vid.current.src = currClip.url;
				vid.current.load();
				vid.current.play();
			}
		}
	};

	const handleNextClip = () => {
		if (vid.current) {
			clipIndex.current = (clipIndex.current + 1) % clips.length;
			const currClip = clips[clipIndex.current];

			if (currClip) {
				if (props.onClipPlaying) props.onClipPlaying(currClip.clipId);

				vid.current.src = currClip.url;
				vid.current.load();
				vid.current.play();
			}
		}
	};

	const handleTimeUpdate = () => {
		if (vid.current) {
			setCurrentTime(vid.current.currentTime);
		}
	};

	useEffect(() => {
		if (vid.current && clips.length > 0) {
			vid.current.src = clips[0].url;
			vid.current.load();
			vid.current.play();
		}
	}, [clips, vid]);

	useEffect(() => {
		clipIndex.current = 0;
	}, [props.clips]);

	return (
		<div
			className="h-full w-full rounded-2xl bg-black relative"
			onMouseOver={() => setShowOverlayController(true)}
			onMouseLeave={() => setShowOverlayController(false)}
		>
			<video
				ref={vid}
				onEnded={handleNextClip}
				onTimeUpdate={handleTimeUpdate}
				className="h-full w-full"
			/>

			{/* video controller */}
			{vid.current && clips && clips.length > 0 && (
				<div
					className={cn(
						"absolute bottom-0 w-full p-4 flex space-x-3",
						showOverlayController ? "opacity-100" : "opacity-0",
						"duration-200 justify-end"
					)}
				>
					<VideoOverlayWrapper>
						<Volume2Icon strokeWidth={1.5} />
						<div className="flex place-items-center space-x-2">
							<button
								onClick={handlePrevClip}
								className="cursor-pointer disabled:pointer-events-none"
								disabled={clipIndex.current === 0}
							>
								<ChevronLeftIcon />
							</button>
							<span>
								{clipIndex.current + 1}/{clips.length}
							</span>
							<button onClick={handleNextClip} className="cursor-pointer">
								<ChevronRightIcon />
							</button>
						</div>

						<button onClick={handlePlayPause} className="cursor-pointer">
							{vid.current.paused ? (
								<PlayIcon strokeWidth={1.5} />
							) : (
								<PauseIcon strokeWidth={1.5} />
							)}
						</button>
					</VideoOverlayWrapper>

					{!props.hideScore && (
						<>
							<VideoOverlayWrapper>{`Home: ${score.home}`}</VideoOverlayWrapper>
							<VideoOverlayWrapper>{`Away: ${score.away}`}</VideoOverlayWrapper>
						</>
					)}
				</div>
			)}
		</div>
	);
}

import { Clip } from "@/types/model/clip";
import { useEffect, useRef, useState } from "react";
import VideoOverlayWrapper from "@/components/media/overlay/video-overlay-wrapper";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PauseIcon,
	PlayIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import VolumeSlider from "@/components/volume-slider";

interface ClipPlayerProps {
	clips: Clip[];
	onClipPlaying?: (clipId: string) => void;
}

export default function ClipPlayer(props: ClipPlayerProps) {
	const { clips } = props;
	const [showOverlayController, setShowOverlayController] = useState(false);
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
			<video ref={vid} onEnded={handleNextClip} className="h-full w-full" />

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
						<VolumeSlider videoRef={vid} />
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
				</div>
			)}
		</div>
	);
}

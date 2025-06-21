import { NewClipFormSectionProps } from "@/types/form-section";
import FormSection from "@/components/form-section";
import { useRef, useState } from "react";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import VideoOverlaySlider from "@/components/video-clipper/video-player/overlay/video-overlay-slider";
import VideoOverlayController from "@/components/video-clipper/video-player/overlay/video-overlay-controller";
import VideoOverlayWrapper from "@/components/video-clipper/video-player/overlay/video-overlay-wrapper";
import { useForm } from "react-hook-form";
import {
	ReviewClipFormFields,
	reviewClipSchema,
} from "@/types/schema/new-clip-form/review-clip-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

export default function ReviewClipSection(props: NewClipFormSectionProps) {
	const {
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ReviewClipFormFields>({
		resolver: zodResolver(reviewClipSchema),
	});

	const highlightTime = watch("highlightTime");
	const source = useVideoClipperStore((s) => s.source);
	const { start, end } = props.clipTime;

	// defining local video data to separate clip from video
	const videoRef = useRef<HTMLVideoElement>(null);
	const [currentTime, setCurrentTime] = useState(start);
	const [isPlaying, setIsPlaying] = useState(false);

	const loadAtStartTime = () => {
		if (videoRef.current) {
			videoRef.current.currentTime = start;
			setCurrentTime(start);
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			const time = videoRef.current.currentTime;

			// handle looping
			if (isPlaying && time >= end) {
				videoRef.current.currentTime = start;
				setCurrentTime(start);
				videoRef.current.play();
			} else {
				setCurrentTime(time);
			}
		}
	};

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<div className="w-full rounded-xl overflow-clip bg-black relative">
				<video
					ref={videoRef}
					className="w-full max-h-[28rem]"
					onLoadedMetadata={loadAtStartTime}
					onTimeUpdate={handleTimeUpdate}
					onPlay={() => setIsPlaying(true)}
					onPause={() => setIsPlaying(false)}
				>
					<source src={source} />
				</video>

				{videoRef.current && (
					<div className="absolute bottom-0 w-full p-4 flex space-x-3">
						<div className="w-[26rem]">
							<VideoOverlayController
								videoRef={videoRef}
								startTime={start}
								endTime={end}
								currentTime={currentTime}
							/>
						</div>
						<div className="w-fit">
							<VideoOverlayWrapper
								className={cn(!!errors.highlightTime && "bg-red-500/30")}
							>
								<button
									type="button"
									className={cn(
										"cursor-pointer",
										!!errors.highlightTime && "text-red-900"
									)}
									onClick={() =>
										setValue("highlightTime", currentTime, {
											shouldValidate: true,
										})
									}
								>
									Add keyframe
								</button>
							</VideoOverlayWrapper>
						</div>
						<div className="w-full">
							<VideoOverlaySlider
								videoRef={videoRef}
								startTime={start}
								endTime={end}
								currentTime={currentTime}
								keyframe={highlightTime}
							/>
						</div>
					</div>
				)}
			</div>
		</FormSection>
	);
}

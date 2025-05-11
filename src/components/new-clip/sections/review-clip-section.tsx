import { NewClipFormSectionProps } from "@/types/form-section";
import FormSection from "@/components/form-section";
import { useRef } from "react";

export default function ReviewClipSection(props: NewClipFormSectionProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	const startTime = props.clipTime.start;
	const endTime = props.clipTime.end;

	const loadAtStartTime = () => {
		if (videoRef.current) {
			videoRef.current.currentTime = startTime;
		}
	};

	const loop = () => {
		if (videoRef.current && videoRef.current.currentTime >= endTime) {
			videoRef.current.currentTime = startTime;
			videoRef.current.play();
		}
	};

	return (
		<FormSection {...props} handleSubmit={undefined}>
			<div className="rounded-xl overflow-clip bg-black">
				<video
					ref={videoRef}
					className="w-full max-h-[28rem]"
					onLoadedMetadata={loadAtStartTime}
					onTimeUpdate={loop}
				>
					<source src={props.videoSource} />
				</video>
			</div>
		</FormSection>
	);
}

import useKeyboardShortcut from "@/hooks/use-keyboard-shortcut";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { ClipTime } from "@/types/clip-time";
import { Dispatch, SetStateAction } from "react";

interface ClipButtonProps {
	hangingClipTime: number | null;
	setHangingClipTime: Dispatch<SetStateAction<number | null>>;
	onClipTime: (clipTime: ClipTime) => void;
}

export default function ClipButton(props: ClipButtonProps) {
	const { currentTime, clips } = useVideoClipperStore((state) => ({
		currentTime: state.currentTime,
		clips: state.clips,
	}));

	const throwOnOverlappingPoint = (time: number) => {
		for (const clip of clips) {
			if (clip.startTime <= time && time <= clip.endTime) {
				throw new Error(
					`Overlapping point ${time} on [${clip.startTime}, ${clip.endTime}]`
				);
			}
		}
	};

	const throwOnOverlappingClip = (startTime: number, endTime: number) => {
		for (const clip of clips) {
			// skip current clip
			if (clip.startTime === startTime) continue;

			if (startTime <= clip.startTime && clip.endTime <= endTime) {
				throw new Error(
					`Overlapping clip [${startTime}, ${endTime}] on [${clip.startTime}, ${clip.endTime}]`
				);
			}
		}
	};

	const defineClip = () => {
		try {
			throwOnOverlappingPoint(currentTime);

			// complete clip
			if (props.hangingClipTime) {
				let newClipTime = null;

				// define start/end time
				if (currentTime < props.hangingClipTime) {
					throwOnOverlappingClip(currentTime, props.hangingClipTime);
					newClipTime = {
						start: currentTime,
						end: props.hangingClipTime,
					} as ClipTime;
				} else {
					throwOnOverlappingClip(props.hangingClipTime, currentTime);
					newClipTime = {
						start: props.hangingClipTime,
						end: currentTime,
					} as ClipTime;
				}

				props.setHangingClipTime(null);
				props.onClipTime(newClipTime);
			}

			// init new clip
			else {
				props.setHangingClipTime(currentTime);
			}
		} catch (error) {
			// TODO: notify error
			console.log(error);
		}
	};

	useKeyboardShortcut({ key: "k" }, defineClip);

	return (
		<>
			<button onClick={defineClip}>clip</button>
		</>
	);
}

import useKeyboardShortcut from "@/hooks/use-keyboard-shortcut";
import { ClipDetails } from "@/types/clip-details";
import { ClipTime } from "@/types/clip-time";
import { Dispatch, SetStateAction } from "react";

interface ClipButtonProps {
	clips: ClipDetails[];
	currentTime: number;
	duration: number;
	hangingClipTime: number | null;
	setHangingClipTime: Dispatch<SetStateAction<number | null>>;
	onClipTime: (clipTime: ClipTime) => void;
}

export default function ClipButton(props: ClipButtonProps) {
	const throwOnOverlappingPoint = (time: number) => {
		for (const clip of props.clips) {
			if (clip.startTime <= time && time <= clip.endTime) {
				throw new Error(
					`Overlapping point ${time} on [${clip.startTime}, ${clip.endTime}]`
				);
			}
		}
	};

	const throwOnOverlappingClip = (startTime: number, endTime: number) => {
		for (const clip of props.clips) {
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
			throwOnOverlappingPoint(props.currentTime);

			// complete clip
			if (props.hangingClipTime) {
				let newClipTime = null;

				// define start/end time
				if (props.currentTime < props.hangingClipTime) {
					throwOnOverlappingClip(props.currentTime, props.hangingClipTime);
					newClipTime = {
						start: props.currentTime,
						end: props.hangingClipTime,
					} as ClipTime;
				} else {
					throwOnOverlappingClip(props.hangingClipTime, props.currentTime);
					newClipTime = {
						start: props.hangingClipTime,
						end: props.currentTime,
					} as ClipTime;
				}

				props.setHangingClipTime(null);
				props.onClipTime(newClipTime);
			}

			// init new clip
			else {
				props.setHangingClipTime(props.currentTime);
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

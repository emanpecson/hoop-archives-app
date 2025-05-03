import useKeyboardShortcut from "@/hooks/use-keyboard-shortcut";
import { ClipTime } from "@/types/clip-time";
import { Dispatch, SetStateAction } from "react";

interface ClipButtonProps {
	clips: ClipTime[];
	setClips: Dispatch<SetStateAction<ClipTime[]>>;
	currentTime: number;
	duration: number;
	pendingClipTime: number | null;
	setPendingClipTime: Dispatch<SetStateAction<number | null>>;
}

export default function ClipButton(props: ClipButtonProps) {
	const throwOnOverlappingPoint = (time: number) => {
		for (const clip of props.clips) {
			if (clip.start <= time && time <= clip.end!) {
				throw new Error(
					`Overlapping point ${time} on [${clip.start}, ${clip.end}]`
				);
			}
		}
	};

	const throwOnOverlappingClip = (startTime: number, endTime: number) => {
		for (const clip of props.clips) {
			// skip current clip
			if (clip.start === startTime) continue;

			if (startTime <= clip.start && clip.end! <= endTime) {
				throw new Error(
					`Overlapping clip [${startTime}, ${endTime}] on [${clip.start}, ${clip.end}]`
				);
			}
		}
	};

	const defineClip = () => {
		try {
			throwOnOverlappingPoint(props.currentTime);

			// complete clip
			if (props.pendingClipTime) {
				let newClip = null;

				// define start/end time
				if (props.currentTime < props.pendingClipTime) {
					throwOnOverlappingClip(props.currentTime, props.pendingClipTime);
					newClip = {
						start: props.currentTime,
						end: props.pendingClipTime,
					} as ClipTime;
				} else {
					throwOnOverlappingClip(props.pendingClipTime, props.currentTime);
					newClip = {
						start: props.pendingClipTime,
						end: props.currentTime,
					} as ClipTime;
				}

				props.setClips((prevClips) => [...prevClips, newClip]);
				props.setPendingClipTime(null);
			}

			// init new clip
			else {
				props.setPendingClipTime(props.currentTime);
			}
		} catch (error) {
			// TODO: notify error
			console.log(error);
		}
	};

	useKeyboardShortcut({ key: "k" }, defineClip);

	return <button onClick={defineClip}>clip</button>;
}

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
	const { currentTime, draft } = useVideoClipperStore((state) => ({
		currentTime: state.currentTime,
		draft: state.draft,
	}));

	const throwOnOverlappingPoint = (time: number) => {
		for (const clip of draft!.clipDrafts) {
			if (clip.startTime <= time && time <= clip.endTime) {
				throw new Error(
					`Overlapping point ${time} on [${clip.startTime}, ${clip.endTime}]`
				);
			}
		}
	};

	const throwOnOverlappingClip = (startTime: number, endTime: number) => {
		for (const clip of draft!.clipDrafts) {
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

	useKeyboardShortcut({ key: "a" }, defineClip);

	return (
		<button
			className="cursor-pointer font-medium w-full h-full space-y-1 text-neutral-500 hover:text-white duration-100"
			onClick={defineClip}
			disabled={!draft}
		>
			<p>Define clip</p>
			<p className="font-mono rounded-md px-2 bg-neutral-800">cmd + a</p>
		</button>
	);
}

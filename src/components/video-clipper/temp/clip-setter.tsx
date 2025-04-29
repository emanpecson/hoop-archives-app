"use client";

import useKeyboardShortcut from "@/hooks/use-keyboard-shortcut";
import { ClipTime } from "@/types/clip-time";
import { Dispatch, SetStateAction, useState } from "react";

interface ClipSetterProps {
	clips: ClipTime[];
	setClips: Dispatch<SetStateAction<ClipTime[]>>;
	currentTime: number;
	duration: number;
}

export default function ClipSetter(props: ClipSetterProps) {
	const [pendingClipEnd, setPendingClipEnd] = useState(false);
	const [currentStart, setCurrentStart] = useState(0);

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

	const setStart = () => {
		try {
			if (props.currentTime === props.duration)
				throw new Error("Can't start clip at end");

			throwOnOverlappingPoint(props.currentTime);

			setCurrentStart(props.currentTime);

			props.setClips((prev) => [
				...prev,
				{ start: props.currentTime, end: null },
			]);
			setPendingClipEnd(true);
		} catch (error) {
			console.log(error);
		}
	};

	const setEnd = () => {
		try {
			if (currentStart >= props.currentTime) {
				throw new Error("Invalid end time");
			}

			throwOnOverlappingPoint(props.currentTime);
			throwOnOverlappingClip(currentStart, props.currentTime);

			props.setClips((prev) =>
				prev.map((clip, i) =>
					i === prev.length - 1 && clip.end === null
						? { ...clip, end: props.currentTime }
						: clip
				)
			);

			setPendingClipEnd(false);
		} catch (error) {
			console.log(error);
		}
	};

	useKeyboardShortcut({ key: "k" }, () => {
		if (pendingClipEnd) {
			setEnd();
		} else {
			setStart();
		}
	});

	return (
		<div className="flex gap-dashboard">
			{!pendingClipEnd ? (
				<button
					className="bg-green-600 text-white px-4 py-1 rounded"
					onClick={setStart}
				>
					Set Start (ctrl + k)
				</button>
			) : (
				<button
					className="bg-red-600 text-white px-4 py-1 rounded"
					onClick={setEnd}
				>
					Set End (ctrl + k)
				</button>
			)}
		</div>
	);
}

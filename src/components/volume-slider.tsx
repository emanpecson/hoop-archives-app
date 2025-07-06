"use client";
import { Volume2Icon, VolumeOffIcon } from "lucide-react";
import { RefObject, useState } from "react";
import { Slider } from "./ui/slider";

interface VolumeSliderProps {
	videoRef: RefObject<HTMLVideoElement | null>;
}

export default function VolumeSlider(props: VolumeSliderProps) {
	const [volume, setValue] = useState(0);

	const adjustVolume = (time: number[]) => {
		const timeValue = time[0];
		if (props.videoRef.current) {
			setValue(timeValue);
			props.videoRef.current.volume = timeValue / 100;
		}
	};

	return (
		<div className="flex place-items-center space-x-1">
			{volume === 0 ? (
				<VolumeOffIcon strokeWidth={1.5} className="shrink-0" />
			) : (
				<Volume2Icon strokeWidth={1.5} className="shrink-0" />
			)}
			<div className="w-20">
				<Slider onValueChange={adjustVolume} value={[volume]} />
			</div>
		</div>
	);
}

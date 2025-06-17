"use client";

import CardButton from "@/components/card-button";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { cn } from "@/lib/utils";
import { ClipDetails } from "@/types/clip-details";
import { ClipTag } from "@/types/enum/clip-tag";
import { useEffect, useState } from "react";

interface ClipDetailsCardProps {
	clip: ClipDetails;
	headline: string;
	tags: ClipTag[];
	onClick: () => void;
}

export default function ClipDetailsCard(props: ClipDetailsCardProps) {
	const currentTime = useVideoClipperStore((state) => state.currentTime);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		setIsActive(
			props.clip.startTime <= currentTime && currentTime <= props.clip.endTime
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime]);

	return (
		<CardButton
			onClick={props.onClick}
			className={cn(isActive && "border-2 border-blue-400")}
		>
			<div className="text-neutral-400 max-w-[20rem]">
				<p className="text-wrap">{props.headline}</p>
				<div className="flex flex-wrap gap-x-1 text-blue-300">
					{props.tags.map((tag, i) => (
						<span key={i}>{tag}</span>
					))}
				</div>
			</div>
		</CardButton>
	);
}

"use client";

import { cn } from "@/lib/utils";
import { DemoTimeline } from "./demo-timeline";
import { useEffect, useRef, useState } from "react";

export default function Scoreboard() {
	// const [step, setStep] = useState(0);
	const step = useRef(0);
	const [time, setTime] = useState(0);
	const duration = 12;
	const scores = [
		{ home: 0, away: 0 },
		{ home: 3, away: 0 },
		{ home: 3, away: 3 },
		{ home: 5, away: 3 },
		{ home: 7, away: 3 },
		{ home: 7, away: 5 },
		{ home: 10, away: 5 },
		{ home: 10, away: 7 },
		{ home: 10, away: 10 },
		{ home: 13, away: 10 },
		{ home: 17, away: 10 },
		{ home: 20, away: 10 },
	];

	// 5/10 = 0.5 * 100 = 50

	useEffect(() => {
		setTimeout(() => {
			const nextStep = step.current + 1;
			const temp = ((nextStep / duration) * 100) % 100;
			setTime(temp);
			step.current = nextStep;
		}, 750);
	}, [time]);

	return (
		<div className="flex flex-col w-fit justify-center space-y-2">
			<p className="text-sm font-medium text-center">{`0:${
				step.current % duration < 10 ? "0" : ""
			}${step.current % duration} / 0:${duration}`}</p>
			<div className="flex justify-center pointer-events-none">
				<DemoTimeline
					className="w-full px-2"
					value={[time]}
					onValueChange={(data) => setTime(data[0])}
				/>
			</div>
			<div
				className={cn(
					"rounded-xl border divide-x-2 flex inset-shadow-sm w-fit",
					"bg-[#161616] border-input-border divide-input-border inset-shadow-neutral-600/60"
				)}
			>
				<span className="w-24 py-3 text-sm text-center">
					Home: {scores[step.current % duration].home}
				</span>
				<span className="w-24 py-3 text-sm text-center">
					Away: {scores[step.current % duration].away}
				</span>
			</div>
		</div>
	);
}

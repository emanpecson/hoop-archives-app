import { LucideIcon } from "lucide-react";

interface DashedBridgeProps {
	icon: LucideIcon;
	dashes: number;
}

export default function DashedBridge(props: DashedBridgeProps) {
	return (
		<>
			{new Array(props.dashes).fill(0).map((_, i) => (
				<div key={i} className="h-[2px] w-4 space-x-1 bg-neutral-600 mx-1" />
			))}

			<props.icon className="shrink-0 text-neutral-600" size={20} />

			{new Array(props.dashes).fill(0).map((_, i) => (
				<div key={i} className="h-[2px] w-4 space-x-1 bg-neutral-600 mx-1" />
			))}
		</>
	);
}

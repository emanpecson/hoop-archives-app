import { cn } from "@/lib/utils";

interface CaptionProps {
	heading: string;
	subheading: string;
	highlight?: boolean;
}

export default function Caption(props: CaptionProps) {
	return (
		<div className={"flex flex-col -space-y-0.5 text-center"}>
			<h2
				className={cn(
					"text-xl font-extrabold text-nowrap",
					props.highlight ? "text-highlight" : "text-white"
				)}
			>
				{props.heading}
			</h2>
			<p className="text-sm font-light text-neutral-500 text-nowrap">
				{props.subheading}
			</p>
		</div>
	);
}

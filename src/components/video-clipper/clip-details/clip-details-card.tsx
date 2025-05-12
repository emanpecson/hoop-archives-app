import CardButton from "@/components/card-button";
import { ClipTag } from "@/types/enum/clip-tag";

interface ClipDetailsCardProps {
	headline: string;
	tags: ClipTag[];
}

export default function ClipDetailsCard(props: ClipDetailsCardProps) {
	return (
		<CardButton>
			<div className="space-y-2 text-neutral-400">
				<p>{props.headline}</p>
				<div className="flex flex-wrap gap-x-1 text-blue-300">
					{props.tags.map((tag, i) => (
						<span key={i}>{tag}</span>
					))}
				</div>
			</div>
		</CardButton>
	);
}

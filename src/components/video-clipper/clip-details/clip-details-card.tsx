import CardButton from "@/components/card-button";
import { ClipTag } from "@/types/enum/clip-tag";

interface ClipDetailsCardProps {
	statement: string;
	tags: ClipTag[];
}

export default function ClipDetailsCard(props: ClipDetailsCardProps) {
	return (
		<CardButton>
			<div className="space-y-4 text-neutral-400">
				<p>{props.statement}</p>
				<div className="flex flex-wrap gap-1">
					{props.tags.map((tag, i) => (
						<span key={i}>{tag}</span>
					))}
				</div>
			</div>
		</CardButton>
	);
}

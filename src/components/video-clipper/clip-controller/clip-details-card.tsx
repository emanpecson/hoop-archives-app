import CardButton from "@/components/card-button";
import { ClipTag } from "@/types/enum/clip-tag";

interface ClipDetailsCardProps {
	headline: string;
	tags: ClipTag[];
	onClick: () => void;
}

export default function ClipDetailsCard(props: ClipDetailsCardProps) {
	return (
		<CardButton onClick={props.onClick}>
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

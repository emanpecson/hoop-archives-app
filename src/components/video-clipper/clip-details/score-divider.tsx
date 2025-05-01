interface ScoreDividerProps {
	score: string;
}

export default function ScoreDivider(props: ScoreDividerProps) {
	return (
		<div className="flex place-items-center space-x-3">
			<hr className="w-full opacity-25" />
			<span className="text-nowrap opacity-50 text-sm">{props.score}</span>
			<hr className="w-full opacity-25" />
		</div>
	);
}

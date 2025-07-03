interface HighlightsViewProps {
	leagueId: string;
}

export default function HighlightsView(props: HighlightsViewProps) {
	return <div>{props.leagueId}</div>;
}

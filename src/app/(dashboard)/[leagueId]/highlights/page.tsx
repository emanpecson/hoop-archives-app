import HighlightsView from "@/components/highlights/highlights-view";

export default async function HighlightsPage({
	params,
}: {
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;
	return <HighlightsView leagueId={leagueId} />;
}

import HighlightBuilder from "@/components/highlights/highlight-builder/highlight-builder";

export default async function HighlightBuilderPage({
	params,
}: {
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;
	return <HighlightBuilder leagueId={leagueId} />;
}

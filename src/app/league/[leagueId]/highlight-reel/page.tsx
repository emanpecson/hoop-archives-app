import ReelsDashboard from "@/components/highlight/highlight-reel/reels-dashboard";

export default async function HighlightReelPage({
	params,
}: {
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;
	return <ReelsDashboard leagueId={leagueId} />;
}

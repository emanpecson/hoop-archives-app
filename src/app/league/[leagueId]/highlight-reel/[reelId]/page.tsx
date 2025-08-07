import ReelOverview from "@/components/highlight/highlight-reel/reel-overview";

export default async function ReelOverviewPage({
	params,
}: {
	params: Promise<{ leagueId: string; reelId: string }>;
}) {
	const { leagueId, reelId } = await params;
	return <ReelOverview leagueId={leagueId} reelId={reelId} />;
}

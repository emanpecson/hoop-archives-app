import GameOverview from "@/components/game/game-overview";

export default async function GameOverviewPage({
	params,
}: {
	params: Promise<{ leagueId: string; title: string }>;
}) {
	const { leagueId, title } = await params;
	return <GameOverview leagueId={leagueId} title={title} />;
}

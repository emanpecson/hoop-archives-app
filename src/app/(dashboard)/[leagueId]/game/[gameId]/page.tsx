import GameOverview from "@/components/game/game-overview";

export default async function GameOverviewPage({
	params,
}: {
	params: Promise<{ leagueId: string; gameId: string }>;
}) {
	const { leagueId, gameId } = await params;
	return <GameOverview leagueId={leagueId} gameId={gameId} />;
}

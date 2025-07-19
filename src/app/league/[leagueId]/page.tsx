import GamesDashboard from "@/components/game/games-dashboard";

export default async function LeaguePage({
	params,
}: {
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;
	return <GamesDashboard leagueId={leagueId} />;
}

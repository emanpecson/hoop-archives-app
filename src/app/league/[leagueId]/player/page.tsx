import PlayerCollection from "@/components/player/player-collection";

export default async function PlayerPage({
	params,
}: {
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;
	return <PlayerCollection leagueId={leagueId} />;
}

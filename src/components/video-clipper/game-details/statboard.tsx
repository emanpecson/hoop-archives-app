import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import { tempLeagueId } from "@/data/temp";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { Player } from "@/types/model/player";
import { initStats, Stats, TempStats } from "@/types/model/stats";
import { DefensivePlay, OffensivePlay } from "@/types/play";
import {
	collectStatsFromClips,
	collectStatsFromGame,
} from "@/utils/collect-stats";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StatboardProps {
	label: "Home Stats" | "Away Stats";
	players: Player[];
	clips?: { offense?: OffensivePlay; defense?: DefensivePlay }[];
	gameStats?: Stats[];
}

export default function Statboard(props: StatboardProps) {
	const setHomeStats = useVideoClipperStore((state) => state.setHomeStats);
	const setAwayStats = useVideoClipperStore((state) => state.setAwayStats);

	const [playerStats, setPlayerStats] = useState<{ [id: string]: TempStats }>(
		{}
	);
	const [teamStats, setTeamStats] = useState<TempStats>(initStats("", ""));

	useEffect(() => {
		// use if game stats have already been statically calculated
		if (props.gameStats) {
			const { playerStats, teamStats } = collectStatsFromGame(
				props.gameStats,
				props.players
			);

			setPlayerStats(playerStats);
			setTeamStats(teamStats);

			if (props.label === "Home Stats") {
				setHomeStats(Object.values(playerStats));
			} else {
				setAwayStats(Object.values(playerStats));
			}
		}

		// otherwise, collect stats from clips
		else if (props.clips && props.clips.length > 0) {
			const { playerStats, teamStats } = collectStatsFromClips(
				tempLeagueId,
				props.players,
				props.clips
			);

			setPlayerStats(playerStats);
			setTeamStats(teamStats);

			if (props.label === "Home Stats") {
				setHomeStats(Object.values(playerStats));
			} else {
				setAwayStats(Object.values(playerStats));
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.clips, props.players]);

	return (
		<div className="w-full space-y-2">
			<DashboardCardHeader text={props.label} />
			<table className="w-full text-sm text-neutral-400">
				<thead>
					<tr>
						<th className="font-normal text-left pb-0.5 px-0.5 text-xs">
							Player
						</th>
						<th className="font-normal text-right pb-0.5 px-0.5 text-xs">
							Pts
						</th>
						<th className="font-normal text-right pb-0.5 px-0.5 text-xs">
							Ast
						</th>
						<th className="font-normal text-right pb-0.5 px-0.5 text-xs">
							Blk
						</th>
					</tr>
				</thead>

				<tbody>
					{props.players.map((p) => (
						<tr key={p.playerId}>
							<td className="text-left py-0.5 px-0.5 flex place-items-center gap-1.5">
								<Image
									src={p.imageUrl}
									className="w-6 h-6 rounded-full object-cover"
									alt="pfp"
									width={24}
									height={24}
								/>
								<span className="text-xs">{`${p.firstName[0]}. ${p.lastName}`}</span>
							</td>
							<td className="text-right py-0.5 px-0.5">
								{playerStats[p.playerId] ? playerStats[p.playerId].points : 0}
							</td>
							<td className="text-right py-0.5 px-0.5">
								{playerStats[p.playerId] ? playerStats[p.playerId].assists : 0}
							</td>
							<td className="text-right py-0.5 px-0.5">
								{playerStats[p.playerId] ? playerStats[p.playerId].blocks : 0}
							</td>
						</tr>
					))}
				</tbody>

				<tfoot>
					<tr>
						<td className="text-left pt-0.5 px-0.5 text-xs">Totals</td>
						<td className="text-right pt-0.5 px-0.5">{teamStats.points}</td>
						<td className="text-right pt-0.5 px-0.5">{teamStats.assists}</td>
						<td className="text-right pt-0.5 px-0.5">{teamStats.blocks}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import { tempLeagueId } from "@/data/temp";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { Player } from "@/types/model/player";
import { initStats, TempStats } from "@/types/model/stats";
import { DefensivePlay, OffensivePlay } from "@/types/play";
import { collectStats } from "@/utils/collect-stats";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StatboardProps {
	label: string;
	players: Player[];
	clips: { offense?: OffensivePlay; defense?: DefensivePlay }[];
}

export default function Statboard(props: StatboardProps) {
	const stats = useVideoClipperStore((state) => state.stats);
	const setStats = useVideoClipperStore((state) => state.setStats);
	const [playerStats, setPlayerStats] = useState<{ [id: string]: TempStats }>(
		{}
	);
	const [teamStats, setTeamStats] = useState<TempStats>(initStats("", ""));

	useEffect(() => {
		const { playerStats, teamStats } = collectStats(
			tempLeagueId,
			props.players,
			props.clips
		);
		setPlayerStats(playerStats);
		setStats({ ...stats, ...Object.values(playerStats) });
		setTeamStats(teamStats);
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
									alt="headshot"
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

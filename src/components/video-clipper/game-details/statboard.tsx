import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import { Player } from "@/types/model/player";
import { DefensivePlay, OffensivePlay } from "@/types/play";
import { collectStats } from "@/utils/stats";
import { useEffect, useState } from "react";

type Stats = {
	pts: number;
	ast: number;
	blk: number;
};

interface StatboardProps {
	label: string;
	players: Player[];
	clips: { offense?: OffensivePlay; defense?: DefensivePlay }[];
}

export default function Statboard(props: StatboardProps) {
	const [playerStats, setPlayerStats] = useState<{ [id: string]: Stats }>({});
	const [teamStats, setTeamStats] = useState<Stats>({ pts: 0, ast: 0, blk: 0 });

	useEffect(() => {
		const { playerStats, teamStats } = collectStats(props.players, props.clips);
		setPlayerStats(playerStats);
		setTeamStats(teamStats);
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
								<div className="w-5 h-5 rounded-full bg-neutral-700" />
								<span className="text-xs">{`${p.firstName[0]}. ${p.lastName}`}</span>
							</td>
							<td className="text-right py-0.5 px-0.5">
								{playerStats[p.playerId] ? playerStats[p.playerId].pts : 0}
							</td>
							<td className="text-right py-0.5 px-0.5">
								{playerStats[p.playerId] ? playerStats[p.playerId].ast : 0}
							</td>
							<td className="text-right py-0.5 px-0.5">
								{playerStats[p.playerId] ? playerStats[p.playerId].blk : 0}
							</td>
						</tr>
					))}
				</tbody>

				<tfoot>
					<tr>
						<td className="text-left pt-0.5 px-0.5 text-xs">Totals</td>
						<td className="text-right pt-0.5 px-0.5">{teamStats.pts}</td>
						<td className="text-right pt-0.5 px-0.5">{teamStats.ast}</td>
						<td className="text-right pt-0.5 px-0.5">{teamStats.blk}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

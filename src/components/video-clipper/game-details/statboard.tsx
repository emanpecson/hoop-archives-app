import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import { ClipDetails } from "@/types/clip-details";
import { Player } from "@/types/model/player";
import { useCallback, useEffect, useState } from "react";

type Stats = {
	pts: number;
	ast: number;
	blk: number;
};

interface StatboardProps {
	label: string;
	players: Player[];
	clips: ClipDetails[];
}

export default function Statboard(props: StatboardProps) {
	const [playerStats, setPlayerStats] = useState<{ [id: string]: Stats }>({});
	const [totals, setTotals] = useState<Stats>({ pts: 0, ast: 0, blk: 0 });

	const getStats = useCallback(() => {
		// initialize stats w/ 0
		const stats: typeof playerStats = Object.fromEntries(
			props.players.map((p) => [p.playerId, { pts: 0, ast: 0, blk: 0 }])
		);
		let totalPts = 0;
		let totalAst = 0;
		let totalBlk = 0;

		console.log("stats:", stats);

		// calculate player stats by clip
		for (const clip of props.clips) {
			if (clip.offense) {
				const scorer = clip.offense.playerScoring;

				if (scorer.playerId in stats) {
					stats[scorer.playerId].pts += clip.offense.pointsAdded;
					totalPts += clip.offense.pointsAdded;

					const assister = clip.offense.playerAssisting;
					if (assister) {
						stats[assister.playerId].ast++;
						totalAst++;
					}
				}
			} else if (clip.defense) {
				const defender = clip.defense.playerDefending;

				if (defender.playerId in stats) {
					stats[defender.playerId].blk++;
					totalBlk++;
				}
			}
		}

		setPlayerStats(stats);
		setTotals({ pts: totalPts, ast: totalAst, blk: totalBlk });
	}, [props.clips, props.players]);

	useEffect(() => {
		getStats();
	}, [props.players, props.clips, getStats]);

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
						<td className="text-right pt-0.5 px-0.5">{totals.pts}</td>
						<td className="text-right pt-0.5 px-0.5">{totals.ast}</td>
						<td className="text-right pt-0.5 px-0.5">{totals.blk}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

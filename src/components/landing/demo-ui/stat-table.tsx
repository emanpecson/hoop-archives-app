import { cn } from "@/lib/utils";
import Image from "next/image";

type Row = {
	playerImage: string;
	player: string;
	pts: number;
	ast: number;
	blk: number;
};

export default function StatTable() {
	const data: Row[] = [
		{
			playerImage: "/user-placeholder.png",
			player: "Max",
			pts: 17,
			ast: 3,
			blk: 0,
		},
		{
			playerImage: "/user-placeholder.png",
			player: "Josh",
			pts: 12,
			ast: 8,
			blk: 3,
		},
		{
			playerImage: "/user-placeholder.png",
			player: "Eman",
			pts: 11,
			ast: 4,
			blk: 1,
		},
	];

	return (
		<div
			className={cn(
				"rounded-xl border w-fit inset-shadow-sm py-2",
				"bg-[#161616] border-input-border inset-shadow-neutral-600/60"
			)}
		>
			<table className="divide-y-2 divide-input-border">
				<thead>
					<tr>
						<th className="pl-4 pr-1 py-1 font-normal text-sm text-neutral-500 text-left">
							Player
						</th>
						<th className="px-2 py-1 font-normal text-sm text-neutral-500 text-right">
							Pts
						</th>
						<th className="px-2 py-1 font-normal text-sm text-neutral-500 text-right">
							Ast
						</th>
						<th className="pr-4 pl-1 py-1 font-normal text-sm text-neutral-500 text-right">
							Blk
						</th>
					</tr>
				</thead>

				<tbody>
					{data.map((row, i) => (
						<tr key={i}>
							<td className="text-left pl-4 pr-1 py-1">
								<div className="flex place-items-center gap-2">
									<Image
										src={row.playerImage}
										alt={"data row"}
										className="w-6 h-6 rounded-full object-cover"
										width={24}
										height={24}
										unoptimized
									/>
									<span>{row.player}</span>
								</div>
							</td>
							<td className="text-right px-1 py-1">{row.pts}</td>
							<td className="text-right px-2 py-1">{row.ast}</td>
							<td className="text-right pr-4 pl-1 py-1">{row.blk}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

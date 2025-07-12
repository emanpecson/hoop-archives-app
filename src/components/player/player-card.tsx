import { Player } from "@/types/model/player";
import Image from "next/image";
// import Image from "next/image";

interface PlayerCardProps {
	player: Player;
}

export default function PlayerCard(props: PlayerCardProps) {
	return (
		<div className="rounded-xl bg-neutral-800 w-40 h-60 flex flex-col place-items-center justify-between py-2 px-4">
			<div className="flex h-full place-items-center">
				<Image
					src={props.player.imageUrl}
					alt={`${props.player.fullName} image`}
					width={24}
					height={24}
					className="object-cover rounded-full w-32 h-32"
					unoptimized
				/>
			</div>

			<div className="text-center w-full">
				<div className="flex justify-between text-sm text-neutral-400">
					<div className="-space-y-1">
						<p>Pts</p>
						<p>0</p>
					</div>

					<div className="-space-y-1">
						<p>Ast</p>
						<p>0</p>
					</div>

					<div className="-space-y-1">
						<p>Blk</p>
						<p>0</p>
					</div>
				</div>

				<div className="-space-y-1.5 text-base font-semibold">
					<p>{props.player.firstName}</p>
					<p>{props.player.lastName}</p>
				</div>
			</div>
		</div>
	);
}

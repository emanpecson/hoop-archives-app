import { Player } from "@/types/model/player";
// import Image from "next/image";

interface PlayerCardProps {
	player: Player;
}

export default function PlayerCard(props: PlayerCardProps) {
	return (
		<div className="rounded-lg bg-neutral-800 w-40 h-60 flex flex-col">
			<div className="-space-y-1.5 text-base font-bold p-3">
				<p>{props.player.firstName}</p>
				<p>{props.player.lastName}</p>
			</div>

			{/* <div className="border-y border-input-border">
				{props.player.imageUrl ? (
					<Image
						src={props.player.imageUrl}
						alt={`${props.player.fullName} image`}
						width={64}
						height={64}
						className="object-cover w-24 h-24"
						unoptimized
					/>
				) : (
					<div className="w-32 h-32 bg-neutral-700/70" />
				)}
			</div> */}
		</div>
	);
}

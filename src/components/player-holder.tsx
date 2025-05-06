import { cn } from "@/lib/utils";
import { Player } from "@/types/model/player";
import { UserCircle2Icon, XIcon } from "lucide-react";

interface PlayerHolderProps {
	player: Player | null;
	onRemove: () => void;
}

export default function PlayerHolder(props: PlayerHolderProps) {
	return (
		<div className="rounded-md h-9 border border-input-border px-3 py-1 flex place-items-center justify-between w-full">
			<div
				className={cn(
					"flex place-items-center gap-2",
					props.player ? "text-white" : "text-input-muted"
				)}
			>
				<UserCircle2Icon size={16} />
				<p>
					{props.player
						? `${props.player.firstName} ${props.player.lastName}`
						: "Player not selected"}
				</p>
			</div>

			{props.player && (
				<button
					className="cursor-pointer hover:text-white duration-150 p-0.5 rounded-full border border-input-border"
					onClick={props.onRemove}
				>
					<XIcon size={12} />
				</button>
			)}
		</div>
	);
}

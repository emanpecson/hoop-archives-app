import { CircleUserRoundIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Player } from "@/types/model/player";
import { useState } from "react";

interface PlayerSelectProps {
	error?: boolean;
	value?: Player;
	playerOptions: Player[];
	onChange: (player: Player) => void;
	disabled?: boolean;
}

export default function PlayerSelect(props: PlayerSelectProps) {
	const playerString = (player: Player | undefined) => {
		if (player) return `${player.firstName} ${player.lastName}`;
		return undefined;
	};

	const [placeholder, setPlaceholder] = useState<string | null>(
		"Select player"
	);

	const handleValueChange = (playerName: string) => {
		const player = props.playerOptions.find(
			(p) => playerString(p) === playerName
		);
		if (player) {
			props.onChange(player);
			setPlaceholder(null);
		}
	};

	return (
		<Select
			onValueChange={handleValueChange}
			value={playerString(props.value)}
			disabled={props.disabled}
		>
			<SelectTrigger
				Icon={CircleUserRoundIcon}
				error={props.error}
				placeholder={props.value ? null : placeholder}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Players</SelectLabel>
					{props.playerOptions.map((player) => (
						<SelectItem
							key={player.playerId}
							value={playerString(player) as string}
						>
							{playerString(player)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

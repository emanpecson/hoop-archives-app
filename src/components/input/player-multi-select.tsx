import { Player } from "@/types/model/player";
import MultiSelect from "./multi-select";
import { UsersIcon } from "lucide-react";

interface PlayerMultiSelectProps {
	error?: boolean;
	value: Player[];
	playerOptions: Player[];
	onChange: (players: Player[]) => void;
	disabled?: boolean;
}

export default function PlayerMultiSelect(props: PlayerMultiSelectProps) {
	const playerToName = (player: Player) => {
		return `${player.firstName} ${player.lastName}`;
	};

	const nameToPlayer = (name: string) => {
		return props.playerOptions.find((p) => playerToName(p) === name)!;
	};

	const handleSelect = (names: string[]) => {
		props.onChange(names.map((name) => nameToPlayer(name)));
	};

	return (
		<MultiSelect
			Icon={UsersIcon}
			onChange={handleSelect}
			placeholder="Select player(s)"
			error={props.error}
			options={props.playerOptions.map((p) => playerToName(p))}
			disabled={props.disabled}
		/>
	);
}

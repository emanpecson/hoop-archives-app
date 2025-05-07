import { FieldErrors } from "react-hook-form";
import ErrorLabel from "./error-label";
import { DynamicPlayersForm } from "@/types/schema/new-game-form/add-players";
import PlayerSlot from "./player-slot";
import { Player } from "@/types/model/player";

interface PlayersPreviewProps {
	label: string;
	targetName: keyof DynamicPlayersForm;
	targetArray: (Player | null)[];
	errors: FieldErrors<DynamicPlayersForm>;
	selectedPlayer: Player | null;
	onUpdate: (
		targetArray: (Player | null)[],
		targetName: keyof DynamicPlayersForm,
		index: number
	) => void;
}

export default function PlayersPreview(props: PlayersPreviewProps) {
	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex text-sm gap-2">
				<label>{props.label}</label>
				{props.errors[props.targetName] &&
					props.errors[props.targetName]!.message && (
						<ErrorLabel
							text={props.errors[props.targetName]!.message as string}
						/>
					)}
			</div>
			{props.targetArray &&
				props.targetArray.map((player, i) => (
					<PlayerSlot
						player={player}
						selectedPlayer={props.selectedPlayer}
						key={i}
						onUpdate={() =>
							props.onUpdate(props.targetArray, props.targetName, i)
						}
					/>
				))}
		</div>
	);
}

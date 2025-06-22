import FormatInputGroup from "./format-input-group";
import { Player } from "@/types/model/player";
import {
	Control,
	Controller,
	FieldErrors,
	UseFormWatch,
} from "react-hook-form";
import {
	ClipDraftFormFields,
	DefensivePlayFormFields,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import PlayerSelect from "@/components/input/player-select";
import TagsCombobox from "@/components/input/tags-combobox";

interface DefenseDetailsProps {
	playerOptions: Player[];
	control: Control<DefensivePlayFormFields>;
	errors: Partial<FieldErrors<DefensivePlayFormFields>>;
	onPrimaryPlayer: (player: Player) => void;
	watch: UseFormWatch<ClipDraftFormFields>;
	getTeamOptions: (
		pivotPlayer: Player | undefined,
		getSameTeam: boolean
	) => Player[];
}

export default function DefenseDetails(props: DefenseDetailsProps) {
	const defender = props.watch("playerDefending");

	return (
		<FormatInputGroup
			labelInputs={[
				{
					label: "Player defending*",
					input: (
						<Controller
							control={props.control}
							name="playerDefending"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									onChange={(player) => {
										field.onChange(player);
										props.onPrimaryPlayer(player);
									}}
									playerOptions={props.playerOptions}
									error={!!props.errors.playerDefending}
								/>
							)}
						/>
					),
				},
				{
					label: "Player stopped*",
					input: (
						<Controller
							control={props.control}
							name="playerStopped"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={props.getTeamOptions(defender, false)}
									error={!!props.errors.playerStopped}
									disabled={!defender}
								/>
							)}
						/>
					),
				},
				{
					label: "Tags*",
					input: (
						<Controller
							control={props.control}
							name="tags"
							render={({ field }) => (
								<TagsCombobox {...field} error={!!props.errors.tags} />
							)}
						/>
					),
				},
			]}
		/>
	);
}

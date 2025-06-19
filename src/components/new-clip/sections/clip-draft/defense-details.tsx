import FormatInputGroup from "./format-input-group";
import { Player } from "@/types/model/player";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { DefensivePlayFormFields } from "@/types/schema/new-clip-form/clip-draft-schema";
import PlayerSelect from "@/components/input/player-select";
import TagsCombobox from "@/components/input/tags-combobox";

interface DefenseDetailsProps {
	playerOptions: Player[];
	control: Control<DefensivePlayFormFields>;
	errors: Partial<FieldErrors<DefensivePlayFormFields>>;
	onPrimaryPlayer: (player: Player) => void;
}

export default function DefenseDetails(props: DefenseDetailsProps) {
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
									playerOptions={props.playerOptions}
									error={!!props.errors.playerStopped}
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

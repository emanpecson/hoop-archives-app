import { Player } from "@/types/model/player";
import { DefensiveHighlightsFormFields } from "@/types/schema/highlights-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FormatInputGroup from "../new-clip/sections/clip-draft/format-input-group";
import PlayerSelect from "../input/player-select";
import TagsCombobox from "../input/tags-combobox";

interface DefenseHighlightsProps {
	playerOptions: Player[];
	control: Control<DefensiveHighlightsFormFields>;
	errors: Partial<FieldErrors<DefensiveHighlightsFormFields>>;
}

export default function DefenseHighlights(props: DefenseHighlightsProps) {
	return (
		<FormatInputGroup
			labelInputs={[
				{
					label: "Player defending",
					input: (
						<Controller
							control={props.control}
							name="playerDefending"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={props.playerOptions}
									error={!!props.errors.playerDefending}
								/>
							)}
						/>
					),
				},
				{
					label: "Player stopped",
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
					label: "Tags",
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

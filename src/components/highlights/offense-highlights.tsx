import { Player } from "@/types/model/player";
import { OffensiveHighlightsFormFields } from "@/types/schema/highlights-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FormatInputGroup from "../new-clip/sections/clip-draft/format-input-group";
import PlayerSelect from "../input/player-select";
import PlayerMultiSelect from "../input/player-multi-select";
import TagsCombobox from "../input/tags-combobox";

interface OffenseDetailsProps {
	playerOptions: Player[];
	control: Control<OffensiveHighlightsFormFields>;
	errors: Partial<FieldErrors<OffensiveHighlightsFormFields>>;
}

export default function OffenseHighlights(props: OffenseDetailsProps) {
	return (
		<FormatInputGroup
			labelInputs={[
				{
					label: "Player scoring",
					input: (
						<Controller
							control={props.control}
							name="playerScoring"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={props.playerOptions}
									error={!!props.errors.playerScoring}
								/>
							)}
						/>
					),
				},
				{
					label: "Player assisting",
					input: (
						<Controller
							control={props.control}
							name="playerAssisting"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={props.playerOptions}
									error={!!props.errors.playerAssisting}
								/>
							)}
						/>
					),
				},
				{
					label: "Players defending",
					input: (
						<Controller
							control={props.control}
							name="playersDefending"
							render={({ field }) => (
								<PlayerMultiSelect
									{...field}
									playerOptions={props.playerOptions}
									error={!!props.errors.playersDefending}
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

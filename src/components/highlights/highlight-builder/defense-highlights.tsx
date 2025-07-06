import { Player } from "@/types/model/player";
import { DefensiveHighlightsFormFields } from "@/types/schema/highlights-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FormatInputGroup from "@/components/new-clip/sections/clip-draft/format-input-group";
import PlayerSelect from "@/components/input/player-select";
import TagsCombobox from "@/components/input/tags-combobox";
import DateRangeInput from "@/components/input/date-range-input";

interface DefenseHighlightsProps {
	key: number;
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
				{
					label: "Date range",
					input: (
						<Controller
							control={props.control}
							name="dateRange"
							render={({ field }) => (
								<DateRangeInput {...field} error={!!props.errors.dateRange} />
							)}
						/>
					),
				},
			]}
		/>
	);
}

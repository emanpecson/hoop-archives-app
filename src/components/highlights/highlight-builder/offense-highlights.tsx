import { Player } from "@/types/model/player";
import { OffensiveHighlightsFormFields } from "@/types/schema/highlights-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import FormatInputGroup from "@/components/new-clip/sections/clip-draft/format-input-group";
import PlayerSelect from "@/components/input/player-select";
import PlayerMultiSelect from "@/components/input/player-multi-select";
import TagsCombobox from "@/components/input/tags-combobox";
import DateRangeInput from "@/components/input/date-range-input";

interface OffenseDetailsProps {
	key: number;
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

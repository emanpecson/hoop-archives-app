import FormatInputGroup from "./format-input-group";
import { Player } from "@/types/model/player";
import { OffensivePlayFormFields } from "@/types/schema/new-clip-form/clip-details-schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import PlayerSelect from "@/components/input/player-select";
import PlayerMultiSelect from "@/components/input/player-multi-select";
import ToggleSelect from "@/components/input/toggle-select";
import TagsCombobox from "@/components/input/tags-combobox";

interface OffenseDetailsProps {
	players: Player[];
	control: Control<OffensivePlayFormFields>;
	errors: Partial<FieldErrors<OffensivePlayFormFields>>;
}

export default function OffenseDetails(props: OffenseDetailsProps) {
	return (
		<FormatInputGroup
			labelInputs={[
				{
					label: "Points added*",
					input: (
						<Controller
							control={props.control}
							name="pointsAdded"
							render={({ field }) => (
								<ToggleSelect
									{...field}
									value={field.value || "2-pointer"}
									options={["2-pointer", "3-pointer"]}
								/>
							)}
						/>
					),
				},
				{
					label: "Player scoring*",
					input: (
						<Controller
							control={props.control}
							name="playerScoring"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={props.players}
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
									playerOptions={props.players}
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
									playerOptions={props.players}
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

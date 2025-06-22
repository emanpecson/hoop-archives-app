import FormatInputGroup from "./format-input-group";
import { Player } from "@/types/model/player";
import {
	ClipDraftFormFields,
	OffensivePlayFormFields,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import {
	Control,
	Controller,
	FieldErrors,
	UseFormWatch,
} from "react-hook-form";
import PlayerSelect from "@/components/input/player-select";
import PlayerMultiSelect from "@/components/input/player-multi-select";
import ToggleSelect from "@/components/input/toggle-select";
import TagsCombobox from "@/components/input/tags-combobox";

interface OffenseDetailsProps {
	playerOptions: Player[];
	control: Control<OffensivePlayFormFields>;
	errors: Partial<FieldErrors<OffensivePlayFormFields>>;
	onPrimaryPlayer: (player: Player) => void;
	watch: UseFormWatch<ClipDraftFormFields>;
	getTeamOptions: (
		pivotPlayer: Player | undefined,
		getSameTeam: boolean
	) => Player[];
}

export default function OffenseDetails(props: OffenseDetailsProps) {
	const scorer = props.watch("playerScoring");

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
									options={[
										{ label: "2-pointer", value: 1 },
										{ label: "3-pointer", value: 2 },
									]}
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
									onChange={(player) => {
										field.onChange(player);
										props.onPrimaryPlayer(player);
									}}
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
									playerOptions={props.getTeamOptions(scorer, true)}
									error={!!props.errors.playerAssisting}
									disabled={!scorer}
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
									playerOptions={props.getTeamOptions(scorer, false)}
									error={!!props.errors.playersDefending}
									disabled={!scorer}
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

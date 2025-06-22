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
	UseFormUnregister,
	UseFormWatch,
} from "react-hook-form";
import PlayerSelect from "@/components/input/player-select";
import PlayerMultiSelect from "@/components/input/player-multi-select";
import ToggleSelect from "@/components/input/toggle-select";
import TagsCombobox from "@/components/input/tags-combobox";
import { getPlayerTeam, getTeamOptions } from "@/utils/player-info";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { useEffect, useState } from "react";

interface OffenseDetailsProps {
	playerOptions: Player[];
	control: Control<OffensivePlayFormFields>;
	errors: Partial<FieldErrors<OffensivePlayFormFields>>;
	onPrimaryPlayer: (player: Player) => void;
	watch: UseFormWatch<ClipDraftFormFields>;
	unregister: UseFormUnregister<ClipDraftFormFields>;
}

export default function OffenseDetails(props: OffenseDetailsProps) {
	const draft = useVideoClipperStore((state) => state.draft);
	const scorer = props.watch("playerScoring");
	const teammate = props.watch("playerAssisting");
	const opponents = props.watch("playersDefending");
	const [controllerKey, setControllerKey] = useState(0);

	useEffect(() => {
		if (scorer) {
			const playerTeam = getPlayerTeam(draft!, scorer);

			if (opponents.length > 0) {
				// reset opponent if team becomes inconsistent
				const opposingTeam = getPlayerTeam(draft!, opponents[0]);
				if (playerTeam === opposingTeam) props.unregister("playersDefending");

				// force re-render
				setControllerKey((prev) => prev + 1);
			}

			if (teammate) {
				// reset teammate if team becomes inconsistent
				const teammateTeam = getPlayerTeam(draft!, teammate);
				if (teammateTeam !== playerTeam) props.unregister("playerAssisting");

				// force re-render
				setControllerKey((prev) => prev + 1);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scorer]);

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
							key={controllerKey}
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={getTeamOptions(draft!, scorer, true)}
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
							key={controllerKey}
							render={({ field }) => (
								<PlayerMultiSelect
									{...field}
									playerOptions={getTeamOptions(draft!, scorer, false)}
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

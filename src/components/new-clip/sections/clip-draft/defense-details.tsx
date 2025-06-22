import FormatInputGroup from "./format-input-group";
import { Player } from "@/types/model/player";
import {
	Control,
	Controller,
	FieldErrors,
	UseFormSetValue,
	UseFormUnregister,
	UseFormWatch,
} from "react-hook-form";
import {
	ClipDraftFormFields,
	DefensivePlayFormFields,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import PlayerSelect from "@/components/input/player-select";
import TagsCombobox from "@/components/input/tags-combobox";
import { useEffect, useState } from "react";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { getPlayerTeam, getTeamOptions } from "@/utils/player-info";

interface DefenseDetailsProps {
	playerOptions: Player[];
	control: Control<DefensivePlayFormFields>;
	errors: Partial<FieldErrors<DefensivePlayFormFields>>;
	onPrimaryPlayer: (player: Player) => void;
	watch: UseFormWatch<ClipDraftFormFields>;
	setValue: UseFormSetValue<ClipDraftFormFields>;
	unregister: UseFormUnregister<ClipDraftFormFields>;
}

export default function DefenseDetails(props: DefenseDetailsProps) {
	const defender = props.watch("playerDefending");
	const opponent = props.watch("playerStopped");
	const draft = useVideoClipperStore((state) => state.draft);
	const [controllerKey, setControllerKey] = useState(0);

	useEffect(() => {
		if (defender) {
			const defendingTeam = getPlayerTeam(draft!, defender);
			const opposingTeam = getPlayerTeam(draft!, opponent);

			// reset opponent data if team becomes inconsistent
			if (defendingTeam === opposingTeam) {
				props.unregister("playerStopped");

				// force component refresh (controller caches initial data)
				setControllerKey((prev) => prev + 1);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defender]);

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
							key={controllerKey}
							control={props.control}
							name="playerStopped"
							render={({ field }) => (
								<PlayerSelect
									{...field}
									playerOptions={getTeamOptions(draft!, defender, false)}
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

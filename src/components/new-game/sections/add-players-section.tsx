import FormSection from "@/components/form-section";
import PlayerList from "@/components/player-list";
import PlayersPreview from "@/components/players-preview";
import { NewGameFormSectionProps } from "@/types/form-section";
import { Player } from "@/types/model/player";
import {
	createPlayersSchema,
	DynamicPlayersForm,
} from "@/types/schema/new-game-form/add-players";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddPlayersSection(props: NewGameFormSectionProps) {
	const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

	// computes schema before useForm calls (useEffect is too late)
	const dyanmicPlayersSchema = useMemo(() => {
		if (props.form && props.form.type)
			return createPlayersSchema(props.form.type);
		return z.object({}); // fallback
	}, [props.form]);

	const {
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
	} = useForm<DynamicPlayersForm>({
		resolver: zodResolver(dyanmicPlayersSchema),
	});

	// get reactive variables from form
	const form = {
		players: watch("players"),
		team1: watch("team1"),
		team2: watch("team2"),
	};

	// initialize arrays for teams/players
	useEffect(() => {
		if (props.form) {
			// flush old data
			if (form.team1) setValue("team1", undefined);
			if (form.team2) setValue("team2", undefined);
			if (form.players) setValue("players", undefined);

			if (["2v2", "3v3", "4v4"].includes(props.form.type)) {
				const teamLength = parseInt(props.form.type[0]);
				setValue("team1", new Array(teamLength).fill(null));
				setValue("team2", new Array(teamLength).fill(null));
			} else if (props.form.type === "1v1") {
				setValue("players", new Array(2).fill(null));
			} else {
				setValue("players", new Array(5).fill(null)); // 3-5 players
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.form.type]);

	// sets slot to player or null
	const updatePlayer = (
		targetArray: (Player | null)[],
		targetName: keyof DynamicPlayersForm,
		index: number
	) => {
		const updateTeam = [...targetArray];
		updateTeam[index] = selectedPlayer;
		setValue(targetName, updateTeam, { shouldValidate: true });
		setSelectedPlayer(null);
	};

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<PlayerList
				onSelect={setSelectedPlayer}
				selectedPlayerId={selectedPlayer ? selectedPlayer.playerId : null}
			/>
			{form.team1 && form.team2 ? (
				<div className="flex justify-between gap-2 w-full">
					<PlayersPreview
						label="Team 1"
						targetName="team1"
						targetArray={form.team1}
						errors={errors}
						selectedPlayer={selectedPlayer}
						onUpdate={updatePlayer}
					/>
					<PlayersPreview
						label="Team 2"
						targetName="team2"
						targetArray={form.team2}
						errors={errors}
						selectedPlayer={selectedPlayer}
						onUpdate={updatePlayer}
					/>
				</div>
			) : (
				<PlayersPreview
					label="Players"
					targetName="players"
					targetArray={form.players!}
					errors={errors}
					selectedPlayer={selectedPlayer}
					onUpdate={updatePlayer}
				/>
			)}
		</FormSection>
	);
}

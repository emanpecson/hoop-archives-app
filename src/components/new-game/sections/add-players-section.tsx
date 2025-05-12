import FormSection from "@/components/form-section";
import PlayerList from "@/components/player-list";
import PlayersPreview from "@/components/players-preview";
import { NewGameFormSectionProps } from "@/types/form-section";
import { Player } from "@/types/model/player";
import {
	createPlayersSchema,
	DynamicPlayersForm,
} from "@/types/schema/new-game-form/add-players-schema";
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
		home: watch("home"),
		away: watch("away"),
	};

	// initialize arrays for teams
	useEffect(() => {
		if (props.form && props.form.type) {
			const teamLength = parseInt(props.form.type[0]);
			setValue("home", new Array(teamLength).fill(null));
			setValue("away", new Array(teamLength).fill(null));
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

			<div className="flex justify-between gap-2 w-full">
				<PlayersPreview
					label="Home"
					targetName="home"
					targetArray={form.home || []}
					errors={errors}
					selectedPlayer={selectedPlayer}
					onUpdate={updatePlayer}
				/>
				<PlayersPreview
					label="Away"
					targetName="away"
					targetArray={form.away || []}
					errors={errors}
					selectedPlayer={selectedPlayer}
					onUpdate={updatePlayer}
				/>
			</div>
		</FormSection>
	);
}

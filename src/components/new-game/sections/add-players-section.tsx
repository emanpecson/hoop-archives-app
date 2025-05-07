import FormSection, { FormSectionProps } from "@/components/form-section";
import PlayerHolder from "@/components/player-holder";
import PlayerList from "@/components/player-list";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@/types/model/player";
import { createPlayersSchema } from "@/types/schema/new-game-form/add-players";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DynamicPlayersForm = {
	team1?: (Player | null)[];
	team2?: (Player | null)[];
	players?: (Player | null)[];
};

export default function AddPlayersSection(props: FormSectionProps) {
	const [playerAddIsOpen, setPlayerAddIsOpen] = useState(false);
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

	const handlePlayerSelect = (player: Player) => {
		setSelectedPlayer(player);
		setPlayerAddIsOpen(true);
	};

	const addPlayer = (targetArray: string) => {
		if (form.team1 && targetArray === "team1") {
			const updateTeam = [...form.team1];
			updateTeam[form.team1.indexOf(null)] = selectedPlayer;
			setValue("team1", updateTeam, { shouldValidate: true });
		} else if (form.team2 && targetArray === "team2") {
			const updateTeam = [...form.team2];
			updateTeam[form.team2.indexOf(null)] = selectedPlayer;
			setValue("team2", updateTeam, { shouldValidate: true });
		} else {
			console.log("unhandled (addPlayer)"); // ! to handle
		}
	};

	const removePlayer = (targetArray: string, index: number) => {
		if (form.team1 && targetArray === "team1") {
			const updateTeam = [...form.team1];
			updateTeam[index] = null;
			setValue("team1", updateTeam, { shouldValidate: true });
		} else if (form.team2 && targetArray === "team2") {
			const updateTeam = [...form.team2];
			updateTeam[index] = null;
			setValue("team2", updateTeam, { shouldValidate: true });
		} else {
			console.log("unhandled case (removePlayer)"); // ! to handle
		}
	};

	return (
		<>
			<FormSection {...props} handleSubmit={handleSubmit}>
				<PlayerList onSelect={handlePlayerSelect} />
				{form.team1 && form.team2 ? (
					<div className="flex justify-between gap-2 w-full">
						<div className="flex flex-col gap-2 w-full">
							<div className="flex text-sm gap-2">
								<label>Team 1</label>
								{!!errors.team1 && (
									<span className="text-red-400 px-2 bg-red-700/10 rounded-md border border-red-700/20">
										{errors.team1.message}
									</span>
								)}
							</div>
							{form.team1.map((player, i) => (
								<PlayerHolder
									player={player}
									key={i}
									onRemove={() => removePlayer("team1", i)}
								/>
							))}
						</div>
						<div className="flex flex-col gap-2 w-full">
							<div className="flex text-sm gap-2">
								<label className="text-sm">Team 2</label>
								{!!errors.team2 && (
									<span className="text-red-400 px-2 bg-red-700/10 rounded-md border border-red-700/20">
										{errors.team2.message}
									</span>
								)}
							</div>
							{form.team2.map((player, i) => (
								<PlayerHolder
									player={player}
									key={i}
									onRemove={() => removePlayer("team2", i)}
								/>
							))}
						</div>
					</div>
				) : (
					<p>unhandled</p> // ! to handle
				)}
			</FormSection>

			<Dialog open={playerAddIsOpen} onOpenChange={setPlayerAddIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add player</DialogTitle>
						<DialogDescription>Select player placement</DialogDescription>
					</DialogHeader>
					{form.team1 && form.team2 ? (
						<div>
							<DialogClose asChild>
								<Button onClick={() => addPlayer("team1")}>Team 1</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button onClick={() => addPlayer("team2")}>Team 2</Button>
							</DialogClose>
						</div>
					) : (
						<p>unhandled</p> // ! to handle
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

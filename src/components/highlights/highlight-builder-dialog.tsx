"use client";

import OffenseHighlights from "@/components/highlights/offense-highlights";
import { useLoadData } from "@/hooks/use-load-data";
import { Player } from "@/types/model/player";
import {
	DefensiveHighlightsFormFields,
	HighlightsFormFields,
	highlightsSchema,
	OffensiveHighlightsFormFields,
} from "@/types/schema/highlights-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Control, useForm } from "react-hook-form";
import DefenseHighlights from "./defense-highlights";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2Icon, ShieldIcon, SwordIcon } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

interface HighlightFilterDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	leagueId: string;
	onSubmit: (queries: string[]) => void;
}

export default function HighlightFilterDialog(
	props: HighlightFilterDialogProps
) {
	const [playerOptions, setPlayerOptions] = useState<Player[]>([]);
	const [isFetchingPlayers, setIsFetchingPlayers] = useState(true);
	const {
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors },
	} = useForm<HighlightsFormFields>({
		resolver: zodResolver(highlightsSchema),
		defaultValues: { play: "offense" },
	});

	useLoadData({
		endpoint: `/api/ddb/${props.leagueId}/players`,
		onDataLoaded: setPlayerOptions,
		setIsLoading: setIsFetchingPlayers,
	});

	const playTypes = { offense: SwordIcon, defense: ShieldIcon };
	const selectedPlay = watch("play");

	const onSubmit = (data: HighlightsFormFields) => {
		console.log(data);
		const queries = [];

		if (data.tags) data.tags.forEach((t) => queries.push(`tags[]=${t}`));

		if (data.play === "offense") {
			queries.push("play=offense");

			if (data.playerScoring)
				queries.push(`playerScoringId=${data.playerScoring.playerId}`);
			if (data.playerAssisting)
				queries.push(`playerAssistingId=${data.playerAssisting.playerId}`);
			if (data.playersDefending) {
				data.playersDefending.forEach((p) =>
					queries.push(`playersDefendingIds[]=${p.playerId}`)
				);
			}
		} else {
			queries.push("play=defense");

			if (data.playerDefending)
				queries.push(`playerDefendingId=${data.playerDefending.playerId}`);
			if (data.playerStopped)
				queries.push(`playerStoppedId=${data.playerStopped.playerId}`);
		}

		props.onSubmit(queries);
	};

	return (
		<Dialog open={props.open} onOpenChange={props.setOpen}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Highlight Filters</DialogTitle>
					<DialogDescription>Choose your highlights</DialogDescription>
				</DialogHeader>

				<div className="flex divide-x divide-neutral-700">
					<div className="space-y-4 flex flex-col pr-2">
						{Object.keys(playTypes).map((play) => {
							const Icon = playTypes[play as keyof typeof playTypes];
							return (
								<Button
									key={play}
									type="button"
									className={cn(
										selectedPlay === play ? "text-white" : "text-input-muted"
									)}
									onClick={() =>
										setValue("play", play as keyof typeof playTypes)
									}
								>
									<Icon />
									<span className="capitalize">{play}</span>
								</Button>
							);
						})}
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
						{isFetchingPlayers && (
							<div className="flex place-items-center space-x-2 justify-center opacity-60">
								<Loader2Icon className="animate-spin" />
								<span>Loading players...</span>
							</div>
						)}

						{selectedPlay === "offense" ? (
							<OffenseHighlights
								playerOptions={playerOptions}
								control={control as Control<OffensiveHighlightsFormFields>}
								errors={errors}
							/>
						) : (
							<DefenseHighlights
								playerOptions={playerOptions}
								control={control as Control<DefensiveHighlightsFormFields>}
								errors={errors}
							/>
						)}

						<div className="flex justify-end">
							<DialogClose asChild>
								<Button variant="input" className="w-fit" type="submit">
									Show highlights
								</Button>
							</DialogClose>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

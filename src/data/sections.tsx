import ConfirmSection from "@/components/new-game/sections/confirm-section";
import GameDetailsSection from "@/components/new-game/sections/game-details-section";
import AddPlayersSection from "@/components/new-game/sections/add-players-section";
import {
	NewGameFormSection,
	NewGameFormSectionProps,
} from "@/types/form-section";

export const newGameSections: NewGameFormSection[] = [
	{
		component: (props: NewGameFormSectionProps) => (
			<GameDetailsSection {...props} />
		),
		label: "Game details",
		step: 0,
	},
	{
		component: (props: NewGameFormSectionProps) => (
			<AddPlayersSection {...props} />
		),
		label: "Add players",
		step: 1,
	},
	{
		component: (props: NewGameFormSectionProps) => (
			<ConfirmSection {...props} />
		),
		label: "Confirm",
		step: 2,
	},
];

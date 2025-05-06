import { FormSectionProps } from "@/components/form-section";
import ConfirmSection from "@/components/new-game/sections/confirm-section";
import GameDetailsSection from "@/components/new-game/sections/game-details-section";
import AddPlayersSection from "@/components/new-game/sections/add-players-section";
import { FormSection } from "@/types/form-section";

export const newGameSections: FormSection[] = [
	{
		component: (props: FormSectionProps) => <GameDetailsSection {...props} />,
		label: "Game details",
		step: 0,
	},
	{
		component: (props: FormSectionProps) => <AddPlayersSection {...props} />,
		label: "Add players",
		step: 1,
	},
	{
		component: (props: FormSectionProps) => <ConfirmSection {...props} />,
		label: "Confirm",
		step: 2,
	},
];

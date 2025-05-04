import { FormSectionProps } from "@/components/form-section";
import ConfirmSection from "@/components/new-game/sections/confirm-section";
import GameDetailsSection from "@/components/new-game/sections/game-details-section";
import PlayersSection from "@/components/new-game/sections/players-section";
import { FormSection } from "@/types/form-section";

export const newGameSections: FormSection[] = [
	{
		component: (props: FormSectionProps) => <GameDetailsSection {...props} />,
		label: "Game details",
		step: 0,
	},
	{
		component: (props: FormSectionProps) => <PlayersSection {...props} />,
		label: "Players",
		step: 1,
	},
	{
		component: (props: FormSectionProps) => <ConfirmSection {...props} />,
		label: "Confirm",
		step: 2,
	},
];

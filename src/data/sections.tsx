import { ConfirmSection as NewGameConfirmSection } from "@/components/new-game/sections/confirm-section";
import GameDetailsSection from "@/components/new-game/sections/game-details-section";
import AddPlayersSection from "@/components/new-game/sections/add-players-section";
import {
	NewClipFormSection,
	NewClipFormSectionProps,
	NewGameFormSection,
	NewGameFormSectionProps,
} from "@/types/form-section";
import ReviewClipSection from "@/components/new-clip/sections/review-clip-section";
import ClipDraftSection from "@/components/new-clip/sections/clip-draft/clip-draft-section";
import { ConfirmSection as NewClipConfirmSection } from "@/components/new-clip/sections/confirm-section";

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
			<NewGameConfirmSection {...props} />
		),
		label: "Confirm",
		step: 2,
	},
];

export const newClipSections: NewClipFormSection[] = [
	{
		component: (props: NewClipFormSectionProps) => (
			<ReviewClipSection {...props} />
		),
		label: "Review clip",
		step: 0,
	},
	{
		component: (props: NewClipFormSectionProps) => (
			<ClipDraftSection {...props} />
		),
		label: "Clip details",
		step: 1,
	},
	{
		component: (props: NewClipFormSectionProps) => (
			<NewClipConfirmSection {...props} />
		),
		label: "Confirm",
		step: 2,
	},
];

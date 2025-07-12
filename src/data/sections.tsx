import { ConfirmSection as NewGameConfirmSection } from "@/components/new-game/sections/confirm-section";
import GameDetailsSection from "@/components/new-game/sections/game-details-section";
import AddPlayersSection from "@/components/new-game/sections/add-players-section";
import {
	FormSection,
	FormSectionProps,
	NewClipFormSection,
	NewClipFormSectionProps,
	NewGameFormSection,
	NewGameFormSectionProps,
} from "@/types/form-section";
import ReviewClipSection from "@/components/new-clip/sections/review-clip-section";
import ClipDraftSection from "@/components/new-clip/sections/clip-draft/clip-draft-section";
import { ConfirmSection as NewClipConfirmSection } from "@/components/new-clip/sections/confirm-section";
import UploadGameSection from "@/components/new-game/sections/upload-game-section";
import PlayerDetailsSection from "@/components/new-player/sections/player-details-section";
import UploadImageSection from "@/components/new-player/sections/upload-image-section";
import ConfirmSection from "@/components/new-player/sections/confirm-section";

export const newGameSections: NewGameFormSection[] = [
	{
		component: (props: NewGameFormSectionProps) => (
			<UploadGameSection {...props} />
		),
		label: "Upload game",
		step: 0,
	},
	{
		component: (props: NewGameFormSectionProps) => (
			<GameDetailsSection {...props} />
		),
		label: "Game details",
		step: 1,
	},
	{
		component: (props: NewGameFormSectionProps) => (
			<AddPlayersSection {...props} />
		),
		label: "Add players",
		step: 2,
	},
	{
		component: (props: NewGameFormSectionProps) => (
			<NewGameConfirmSection {...props} />
		),
		label: "Confirm",
		step: 3,
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

export const newPlayerSections: FormSection[] = [
	{
		component: (props: FormSectionProps) => <PlayerDetailsSection {...props} />,
		label: "Player details",
		step: 0,
	},
	{
		component: (props: FormSectionProps) => <UploadImageSection {...props} />,
		label: "Upload image",
		step: 1,
	},
	{
		component: (props: FormSectionProps) => <ConfirmSection {...props} />,
		label: "Confirm",
		step: 2,
	},
];

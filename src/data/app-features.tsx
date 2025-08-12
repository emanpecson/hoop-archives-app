import {
	FilmIcon,
	LucideIcon,
	ScissorsSquareIcon,
	SparklesIcon,
} from "lucide-react";

export type AppFeature = {
	icon: LucideIcon;
	label: string;
};

export const appFeatures: AppFeature[] = [
	{ icon: ScissorsSquareIcon, label: "Clip plays" },
	{ icon: FilmIcon, label: "Replay games" },
	{ icon: SparklesIcon, label: "Highlight reels" },
];

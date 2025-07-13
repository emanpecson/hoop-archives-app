import { z } from "zod";
import { debounce } from "lodash";
import { CheckUniqueTitleResponse } from "@/types/api/check-unique-title";
import { tempLeagueId } from "@/data/temp";

const fileNameSafeRegex = /^[a-zA-Z0-9_-]+$/;

const debouncedTitleCheck = debounce(
	async (title: string): Promise<boolean> => {
		try {
			const res = await fetch(
				`/api/ddb/${tempLeagueId}/drafts/check-unique?title=${encodeURIComponent(
					title
				)}`
			);
			const { titleExists }: CheckUniqueTitleResponse = await res.json();
			console.log("title exists:", titleExists);
			return !titleExists;
		} catch (error) {
			console.error("Title uniqueness check failed:", error);
			return true;
		}
	},
	300
);

export const gameDetailsSchema = z.object({
	title: z
		.string()
		.min(1, "Required")
		.max(30, "Max length of 30 characters")
		.refine(debouncedTitleCheck, {
			message: "This title already exists",
			// path to make error more specific
			path: ["title"],
		}),
	date: z.date({ message: "Required" }),
	type: z.string().min(1, "Required").regex(fileNameSafeRegex, {
		message:
			"Must only contain letters, numbers, underscores, or dashes (no spaces or dots)",
	}),
});

export type GameDetailsFormFields = z.infer<typeof gameDetailsSchema>;

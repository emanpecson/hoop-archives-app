import { DefensivePlay, OffensivePlay } from "./play";
import { ClipDraftFormFields } from "./schema/new-clip-form/clip-draft-schema";

export interface ClipDraft {
	startTime: number;
	endTime: number;
	tags: string[];

	teamBeneficiary?: string;
	offense?: OffensivePlay;
	defense?: DefensivePlay;

	form: ClipDraftFormFields;
}

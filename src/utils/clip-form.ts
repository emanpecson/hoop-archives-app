import { ClipDraft } from "@/types/clip-draft";
import { ClipTime } from "@/types/clip-time";
import { ClipDraftFormFields } from "@/types/schema/new-clip-form/clip-draft-schema";
import { ReviewClipFormFields } from "@/types/schema/new-clip-form/review-clip-schema";

const buildClipDraft = (
	form: ClipDraftFormFields & ReviewClipFormFields,
	clipTime: ClipTime
) => {
	return {
		form: form,
		startTime: clipTime.start,
		endTime: clipTime.end,
		highlightTime: form.highlightTime,
		tags: form.tags,
		teamBeneficiary: form.play === "offense" ? form.teamBeneficiary : undefined,
		offense:
			form.play === "offense"
				? {
						pointsAdded: form.pointsAdded,
						playerScoring: form.playerScoring,
						playerAssisting: form.playerAssisting,
						playersDefending: form.playersDefending,
				  }
				: undefined,
		defense:
			form.play === "defense"
				? {
						playerDefending: form.playerDefending,
						playerStopped: form.playerStopped,
				  }
				: undefined,
	} as ClipDraft;
};

export { buildClipDraft };

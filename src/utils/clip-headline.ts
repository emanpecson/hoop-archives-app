import { ClipDraft } from "@/types/clip-draft";

export const clipHeadline = (clip: ClipDraft) => {
	if (clip.offense) {
		const scorer = `${clip.offense.playerScoring.firstName}`;
		const playmaker = clip.offense.playerAssisting
			? `${clip.offense.playerAssisting.firstName}`
			: undefined;
		const defenders = clip.offense.playersDefending.map(
			(p) => `${p.firstName}`
		);

		let headline = `${
			clip.teamBeneficiary ? `${clip.teamBeneficiary}:` : ""
		} ${scorer} scored ${clip.offense.pointsAdded} point(s)`;
		if (playmaker) {
			headline += `, assisted by ${playmaker}`;
		}
		if (defenders.length > 0) {
			headline += `, defended by ${defenders.join(", ")}`;
		}
		return headline;
	} else if (clip.defense) {
		const defender = `${clip.defense.playerDefending.firstName}`;
		const opponent = `${clip.defense.playerStopped.firstName}`;

		return `${defender} stopped ${opponent}`;
	}
	return "N/A";
};

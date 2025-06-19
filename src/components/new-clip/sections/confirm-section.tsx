import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { ClipDraft } from "@/types/clip-draft";
import { NewClipFormSectionProps } from "@/types/form-section";

export function ConfirmSection(props: NewClipFormSectionProps) {
	const draft = useVideoClipperStore((state) => state.draft!);

	const saveClipDraft = async () => {
		try {
			const newClip = {
				startTime: props.clipTime.start,
				endTime: props.clipTime.end,
				tags: props.form.tags,
				teamBeneficiary: props.form.teamBeneficiary,
				offense:
					props.form.play === "offense"
						? {
								pointsAdded: props.form.pointsAdded,
								playerScoring: props.form.playerScoring,
								playerAssisting: props.form.playerAssisting,
								playersDefending: props.form.playersDefending,
						  }
						: undefined,
				defense:
					props.form.play === "defense"
						? {
								playerDefending: props.form.playerDefending,
								playerStopped: props.form.playerStopped,
						  }
						: undefined,
			} as ClipDraft;

			const res = await fetch(
				`/api/ddb/game-drafts/clip-drafts?title=${draft.title}`,
				{
					method: "POST",
					body: JSON.stringify(newClip),
				}
			);

			if (res.ok) {
				console.log("success:", await res.json());
				props.onClipCreate(newClip);
			} else {
				throw new Error("Failed to save clip");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<FormSection {...props} handleSubmit={undefined}>
			<Button type="button" onClick={saveClipDraft}>
				create clip
			</Button>
		</FormSection>
	);
}

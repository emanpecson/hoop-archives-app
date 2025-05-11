import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { ClipDetails } from "@/types/clip-details";
import { NewClipFormSectionProps } from "@/types/form-section";

export function ConfirmSection(props: NewClipFormSectionProps) {
	const saveClipDetails = async () => {
		try {
			const newClip = {
				startTime: props.clipTime.start,
				endTime: props.clipTime.end,
				tags: props.form.tags,
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
			} as ClipDetails;

			const res = await fetch(
				`/api/ddb/game-drafts/clip-details?title=${props.draft.title}`,
				{
					method: "PUT",
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
			<Button type="button" onClick={saveClipDetails}>
				create clip
			</Button>
		</FormSection>
	);
}

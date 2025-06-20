import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { NewClipFormSectionProps } from "@/types/form-section";
import { buildClipDraft } from "@/utils/clip-form";

export function ConfirmSection(props: NewClipFormSectionProps) {
	const draft = useVideoClipperStore((state) => state.draft!);

	const saveClipDraft = async () => {
		try {
			const newClip = buildClipDraft(props.form, props.clipTime);

			const res = await fetch(
				`/api/ddb/game-drafts/clip-drafts?title=${draft.title}`,
				{
					method: "POST",
					body: JSON.stringify(newClip),
				}
			);

			if (res.ok) {
				console.log("success:", await res.json());
				props.onClipSubmit(newClip);
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

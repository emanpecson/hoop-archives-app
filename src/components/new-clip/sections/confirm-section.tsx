import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { tempLeagueId } from "@/data/temp";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { NewClipFormSectionProps } from "@/types/form-section";
import { buildClipDraft } from "@/utils/clip-form";
import { clipHeadline } from "@/utils/clip-headline";

export function ConfirmSection(props: NewClipFormSectionProps) {
	const draft = useVideoClipperStore((state) => state.draft!);

	const saveClipDraft = async () => {
		try {
			const newClip = buildClipDraft(props.form, props.clipTime);

			const res = await fetch(
				`/api/ddb/${tempLeagueId}/drafts/${draft.draftId}/clip-drafts`,
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
			<div className="space-y-4 text-sm">
				<p>{clipHeadline(buildClipDraft(props.form, props.clipTime))}</p>
				<p>{props.form.tags && (props.form.tags as string[]).join(" ")}</p>
			</div>

			<Button
				type="button"
				variant="input"
				className="w-fit"
				onClick={saveClipDraft}
			>
				Create clip
			</Button>
		</FormSection>
	);
}

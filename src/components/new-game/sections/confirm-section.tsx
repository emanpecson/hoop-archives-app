"use client";

import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { tempLeagueId } from "@/data/temp";
import { NewGameFormSectionProps } from "@/types/form-section";
import { Draft } from "@/types/model/draft";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ConfirmSection(props: NewGameFormSectionProps) {
	const router = useRouter();

	// upload form data to ddb
	const createDraft = async () => {
		try {
			const res = await fetch(`/api/ddb/${tempLeagueId}/drafts`, {
				method: "POST",
				body: JSON.stringify({
					...props.form,
					draftId: props.draftId,
					bucketKey: props.bucketKey,
				} as Draft),
			});

			if (res.ok) {
				router.push(`/league/${tempLeagueId}/draft/${props.draftId}`);
			} else {
				throw new Error("Failed to save game");
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to create draft");
		}
	};

	return (
		<FormSection {...props} handleSubmit={undefined}>
			{props.progress === 1 ? (
				<Button
					className="w-fit"
					variant="input"
					type="button"
					onClick={createDraft}
				>
					Create project
				</Button>
			) : (
				<p>Awaiting upload...</p>
			)}
		</FormSection>
	);
}

import FormSection from "@/components/form-section";
import { NewClipFormSectionProps } from "@/types/form-section";
import { useForm } from "react-hook-form";
import {
	ClipDraftFormFields,
	clipDraftSchema,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ClipDetails from "@/components/clip-details";

export default function ClipDraftSection(props: NewClipFormSectionProps) {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		unregister,
		formState: { errors },
	} = useForm<ClipDraftFormFields>({
		resolver: zodResolver(clipDraftSchema),
		defaultValues: { play: "offense", pointsAdded: 1 },
	});

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<ClipDetails
				control={control}
				errors={errors}
				setValue={setValue}
				watch={watch}
				unregister={unregister}
			/>
		</FormSection>
	);
}

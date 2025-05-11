import FormSection from "@/components/form-section";
import { NewClipFormSectionProps } from "@/types/form-section";

export function ConfirmSection(props: NewClipFormSectionProps) {
	return (
		<FormSection {...props} handleSubmit={undefined}>
			confirm
		</FormSection>
	);
}

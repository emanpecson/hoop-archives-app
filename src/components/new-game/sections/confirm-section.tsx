import FormSection, { FormSectionProps } from "@/components/form-section";

export default function ConfirmSection(props: FormSectionProps) {
	return (
		<FormSection {...props} handleSubmit={undefined}>
			confirm
		</FormSection>
	);
}

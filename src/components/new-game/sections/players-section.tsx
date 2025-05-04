import FormSection, { FormSectionProps } from "@/components/form-section";

export default function PlayersSection(props: FormSectionProps) {
	return (
		<FormSection {...props} handleSubmit={undefined}>
			players
		</FormSection>
	);
}

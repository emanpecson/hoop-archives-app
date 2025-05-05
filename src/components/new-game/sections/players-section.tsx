import FormSection, { FormSectionProps } from "@/components/form-section";
import PlayerList from "@/components/player-list";

export default function PlayersSection(props: FormSectionProps) {
	return (
		<FormSection {...props} handleSubmit={undefined}>
			<PlayerList />
		</FormSection>
	);
}

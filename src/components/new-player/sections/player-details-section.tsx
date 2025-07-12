import { FormSectionProps } from "@/types/form-section";
import FormSection from "@/components/form-section";
import {
	PlayerDetailsFormFields,
	playerDetailsSchema,
} from "@/types/schema/new-player-form/player-details-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { TextIcon } from "lucide-react";

export default function PlayerDetailsSection(props: FormSectionProps) {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<PlayerDetailsFormFields>({
		resolver: zodResolver(playerDetailsSchema),
	});

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<Input
				Icon={TextIcon}
				{...register("firstName")}
				placeholder="First name"
				error={!!errors.firstName}
			/>
			<Input
				Icon={TextIcon}
				{...register("lastName")}
				placeholder="Last name"
				error={!!errors.lastName}
			/>
		</FormSection>
	);
}

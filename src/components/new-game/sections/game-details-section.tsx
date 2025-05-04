import FormSection, { FormSectionProps } from "@/components/form-section";
import DateInput from "@/components/input/date-input";
import { Input } from "@/components/ui/input";
import {
	GameDetailsFormFields,
	gameDetailsSchema,
} from "@/types/schema/game-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPenIcon, SwordsIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

export default function GameDetailsSection(props: FormSectionProps) {
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
	} = useForm<GameDetailsFormFields>({
		resolver: zodResolver(gameDetailsSchema),
	});

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<Input
				Icon={FolderPenIcon}
				{...register("title")}
				placeholder="Enter title..."
				error={!!errors.title}
			/>
			<Controller
				name={"date"}
				control={control}
				render={({ field }) => <DateInput {...field} error={!!errors.date} />}
			/>
			<Input
				Icon={SwordsIcon}
				{...register("type")}
				placeholder="Select gasme type..."
				error={!!errors.type}
			/>
		</FormSection>
	);
}

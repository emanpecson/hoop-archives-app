import FormSection from "@/components/form-section";
import DateInput from "@/components/input/date-input";
import GameTypeSelect from "@/components/input/game-type-select";
import { Input } from "@/components/ui/input";
import { NewGameFormSectionProps } from "@/types/form-section";
import {
	GameDetailsFormFields,
	gameDetailsSchema,
} from "@/types/schema/new-game-form/game-details-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPenIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

export default function GameDetailsSection(props: NewGameFormSectionProps) {
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
				defaultValue={props.videoFile!.name}
				Icon={FolderPenIcon}
				{...register("title")}
				placeholder="Enter title..."
				error={!!errors.title}
			/>
			<Controller
				defaultValue={new Date()}
				control={control}
				name="date"
				render={({ field }) => <DateInput {...field} error={!!errors.date} />}
			/>
			<Controller
				control={control}
				name="type"
				render={({ field }) => (
					<GameTypeSelect {...field} error={!!errors.type} />
				)}
			/>
		</FormSection>
	);
}

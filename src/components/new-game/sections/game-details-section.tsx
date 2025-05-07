import FormSection, { FormSectionProps } from "@/components/form-section";
import DateInput from "@/components/input/date-input";
import PlayerSelect from "@/components/input/game-type-select";
import { Input } from "@/components/ui/input";
import {
	GameDetailsFormFields,
	gameDetailsSchema,
} from "@/types/schema/new-game-form/game-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPenIcon } from "lucide-react";
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
				defaultValue={props.videoFile.name}
				Icon={FolderPenIcon}
				{...register("title")}
				placeholder="Enter title..."
				error={!!errors.title}
			/>
			<Controller
				defaultValue={new Date()}
				name="date"
				control={control}
				render={({ field }) => <DateInput {...field} error={!!errors.date} />}
			/>
			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<PlayerSelect {...field} error={!!errors.type} />
				)}
			/>
		</FormSection>
	);
}

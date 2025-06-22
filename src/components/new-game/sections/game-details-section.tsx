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
import { FolderPenIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function GameDetailsSection(props: NewGameFormSectionProps) {
	const {
		handleSubmit,
		control,
		register,
		watch,
		trigger,
		formState: { errors },
	} = useForm<GameDetailsFormFields>({
		resolver: zodResolver(gameDetailsSchema),
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const title = watch("title");
	const [isValidatingTitle, setIsValidatingTitle] = useState(false);

	const getDefaultTitle = () => {
		const filename = props.videoFile!.name;
		const dotIndex = filename.indexOf(".");
		return filename.substring(0, dotIndex);
	};

	// force revalidation after a delay to catch async zod validation results
	useEffect(() => {
		if (title) {
			setIsValidatingTitle(true);
			const timer = setTimeout(() => {
				trigger("title"); // force revalidation on change
				setIsValidatingTitle(false);
			}, 350);

			return () => clearTimeout(timer);
		}
	}, [title, trigger]);

	return (
		<FormSection
			{...props}
			handleSubmit={handleSubmit}
			disableNavigation={isValidatingTitle}
		>
			<div className="w-full relative">
				<Input
					defaultValue={getDefaultTitle()}
					Icon={FolderPenIcon}
					{...register("title")}
					placeholder="Enter title..."
					error={!!errors.title}
				/>

				{isValidatingTitle && (
					<div className="flex place-items-center space-x-2 absolute top-2 right-4 opacity-50">
						<Loader2Icon size={20} className="animate-spin" />
						<span className="text-sm">Checking title...</span>
					</div>
				)}
			</div>

			<Controller
				defaultValue={new Date(props.videoFile!.lastModified)}
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

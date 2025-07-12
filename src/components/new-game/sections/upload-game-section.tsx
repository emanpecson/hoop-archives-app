"use client";

import FormSection from "@/components/form-section";
import { NewGameFormSectionProps } from "@/types/form-section";
import { Controller, useForm } from "react-hook-form";
import {
	UploadGameFormFields,
	uploadGameSchema,
} from "@/types/schema/new-game-form/upload-game-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploader from "@/components/input/file-uploader";

export default function UploadGameSection(props: NewGameFormSectionProps) {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<UploadGameFormFields>({
		resolver: zodResolver(uploadGameSchema),
	});

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<Controller
				control={control}
				name="videoFile"
				render={({ field }) => (
					<FileUploader
						{...field}
						accepts="video"
						supportedFiles=".mp4, .mov"
						maxSize="2GB"
						errorMessage={
							errors.videoFile ? errors.videoFile.message : undefined
						}
					/>
				)}
			/>
		</FormSection>
	);
}

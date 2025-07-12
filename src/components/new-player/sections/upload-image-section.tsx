import FormSection from "@/components/form-section";
import FileUploader from "@/components/input/file-uploader";
import { FormSectionProps } from "@/types/form-section";
import {
	UploadImageFormFields,
	uploadImageSchema,
} from "@/types/schema/new-player-form/upload-image-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export default function UploadImageSection(props: FormSectionProps) {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<UploadImageFormFields>({
		resolver: zodResolver(uploadImageSchema),
	});

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
			<Controller
				control={control}
				name="imageFile"
				render={({ field }) => (
					<FileUploader
						{...field}
						accepts="image"
						supportedFiles=".jpeg, .png, .webp"
						maxSize="5MB"
						errorMessage={
							errors.imageFile ? errors.imageFile.message : undefined
						}
					/>
				)}
			/>
		</FormSection>
	);
}

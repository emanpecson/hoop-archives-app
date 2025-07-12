import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { tempLeagueId } from "@/data/temp";
import { NewPlayerRequestBody } from "@/types/api/new-player";
import { FormSectionProps } from "@/types/form-section";
import { readImageFile } from "@/utils/image-data";
import { S3Uploader } from "@/utils/s3-uploader";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ConfirmSection(props: FormSectionProps) {
	const s3Uploader = new S3Uploader();
	const [isUploading, setIsUploading] = useState(false);
	const [imageUploadProgress, setImageUploadProgress] = useState(0);
	const { firstName, lastName, imageFile } = props.form;
	const imageExtension = imageFile
		? `.${(imageFile as File).name.split(".")[1]}`
		: undefined;
	const s3PlayerImageKey = `${lastName}${firstName}_headshot${imageExtension}`;
	const imageRef = useRef<HTMLImageElement>(null);

	const s3Upload = async (key: string, image: File) => {
		const partSize = 1 * 1024 * 1024; // 1mb

		const { uploadId, presignedUrls } = await s3Uploader.startUpload(
			key,
			image,
			partSize
		);

		const uploadParts = await s3Uploader.uploadByParts(
			image,
			partSize,
			presignedUrls,
			(p) => setImageUploadProgress(p)
		);

		const { location } = await s3Uploader.completeUpload(
			uploadId,
			key,
			uploadParts
		);
		return location;
	};

	const createPlayer = async () => {
		try {
			setIsUploading(true);

			// upload player image in s3
			const imageUrl = await s3Upload(s3PlayerImageKey, imageFile);

			// create player data object in ddb
			const res = await fetch(`/api/ddb/${tempLeagueId}/players`, {
				method: "POST",
				body: JSON.stringify({
					firstName,
					lastName,
					imageUrl,
				} as NewPlayerRequestBody),
			});

			if (res.ok) {
				toast.success(`Created player: ${firstName} ${lastName}`);
				if (props.onClose) props.onClose();
			}
		} catch (error) {
			console.log(error);
			toast.error("Error creating new player");
		} finally {
			setIsUploading(false);
		}
	};

	useEffect(() => {
		const setImageSource = async () => {
			if (imageRef.current && imageFile) {
				const data = await readImageFile(imageFile);
				imageRef.current.src = data;
			}
		};
		setImageSource();
	}, [imageFile, imageRef]);

	return (
		<FormSection {...props} handleSubmit={undefined}>
			<div className="space-y-2 w-full flex flex-col place-items-center">
				<p className="font-bold text-lg capitalize">
					{firstName} {lastName}
				</p>
				<div className="rounded-full w-28 h-28 border border-input-border overflow-clip">
					<Image
						ref={imageRef}
						src="/user-placeholder.png"
						alt="uploaded image"
						height={24}
						width={24}
						className="object-cover w-full h-full"
						unoptimized
					/>
				</div>

				<Button
					type="button"
					variant="input"
					className="w-fit"
					onClick={createPlayer}
					disabled={isUploading}
				>
					Create player
				</Button>

				{isUploading && <Progress value={imageUploadProgress * 100} />}
			</div>
		</FormSection>
	);
}

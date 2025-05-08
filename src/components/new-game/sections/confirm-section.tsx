"use client";

import FormSection from "@/components/form-section";
import { NewGameFormSectionProps } from "@/types/form-section";
import { S3Uploader } from "@/utils/s3-uploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmSection(props: NewGameFormSectionProps) {
	const [isComplete, setIsComplete] = useState(false);
	const s3Uploader = new S3Uploader();
	const router = useRouter();

	const uploadVideo = async (videoFile: File) => {
		try {
			await s3Uploader.handleUpload(videoFile);
			setIsComplete(true);
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	// upload form data to ddb
	const createDraft = async (filename: string) => {
		try {
			const res = await fetch(
				`/api/ddb/drafts?filename=${props.videoFile!.name}`,
				{
					method: "PUT",
					body: JSON.stringify(props.form),
				}
			);

			if (res.ok) {
				router.push(`/video-clipper/${filename}`);
			} else {
				throw new Error("Failed to save game");
			}
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	useEffect(() => {
		if (props.videoFile) {
			uploadVideo(props.videoFile);
		}
	}, [props.videoFile]);

	return (
		<FormSection {...props} handleSubmit={undefined}>
			{isComplete && props.videoFile ? (
				<div>
					<button
						type="button"
						onClick={() => createDraft(props.videoFile!.name)}
					>
						Create project
					</button>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</FormSection>
	);
}

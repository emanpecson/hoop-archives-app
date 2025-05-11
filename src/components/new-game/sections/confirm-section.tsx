"use client";

import FormSection from "@/components/form-section";
import { NewGameFormSectionProps } from "@/types/form-section";
import { S3Uploader } from "@/utils/s3-uploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ConfirmSection(props: NewGameFormSectionProps) {
	const [isComplete, setIsComplete] = useState(false);
	const s3Uploader = new S3Uploader();
	const router = useRouter();

	const uploadVideo = async (videoFile: File) => {
		try {
			await s3Uploader.handleUpload(props.form.title, videoFile);
			setIsComplete(true);
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	// upload form data to ddb
	const createDraft = async (title: string) => {
		try {
			const res = await fetch(`/api/ddb/drafts`, {
				method: "PUT",
				body: JSON.stringify(props.form),
			});

			if (res.ok) {
				router.push(`/video-clipper/${title}`);
			} else {
				throw new Error("Failed to save game");
			}
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	useEffect(() => {
		if (props.form.title && props.videoFile) {
			uploadVideo(props.videoFile);
		}
	}, [props.videoFile, props.form]);

	return (
		<FormSection {...props} handleSubmit={undefined}>
			{isComplete && props.videoFile ? (
				<div>
					<button type="button" onClick={() => createDraft(props.form.title)}>
						Create project
					</button>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</FormSection>
	);
}

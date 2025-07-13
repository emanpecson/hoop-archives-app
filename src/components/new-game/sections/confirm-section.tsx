"use client";

import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { tempLeagueId } from "@/data/temp";
import { NewGameFormSectionProps } from "@/types/form-section";
import { Draft } from "@/types/model/draft";
import { generateId } from "@/utils/generate-id";
import { S3Uploader } from "@/utils/s3-uploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ConfirmSection(props: NewGameFormSectionProps) {
	const s3Uploader = new S3Uploader();
	const router = useRouter();
	const [progress, setProgress] = useState(0);

	const s3Upload = async (key: string, vid: File) => {
		// 10 MB part size (i.e. 5 GB upload -> ~500 parts)
		const partSize = 10 * 1024 * 1024;

		const { uploadId, presignedUrls } = await s3Uploader.startUpload(
			key,
			vid,
			partSize
		);

		const uploadParts = await s3Uploader.uploadByParts(
			vid,
			partSize,
			presignedUrls,
			(p) => setProgress(p)
		);

		await s3Uploader.completeUpload(uploadId, key, uploadParts);
	};

	const uploadVideo = async (videoFile: File) => {
		try {
			const ext = videoFile.name.substring(videoFile.name.indexOf("."));

			await s3Upload(props.form.title + ext, videoFile);
		} catch (error) {
			console.log(error);
			toast.error("Failed to upload video");
		}
	};

	// upload form data to ddb
	const createDraft = async (title: string, videoFile: File) => {
		try {
			const ext = videoFile.name.substring(videoFile.name.indexOf("."));

			const res = await fetch(`/api/ddb/${tempLeagueId}/drafts`, {
				method: "POST",
				body: JSON.stringify({
					...props.form,
					draftId: generateId("draft"),
					bucketKey: title + ext,
				} as Draft),
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
		if (props.form.title && props.form.videoFile) {
			uploadVideo(props.form.videoFile);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.form.videoFile, props.form]);

	return (
		<FormSection {...props} handleSubmit={undefined}>
			<div className="text-sm flex flex-col space-y-2">
				<label>
					Video status:{" "}
					{progress !== 1
						? `Preparing... ${(progress * 100).toFixed(0)}%`
						: "Ready"}
				</label>

				{progress !== 1 ? (
					<Progress value={progress * 100} />
				) : (
					<Button
						className="w-fit"
						variant="input"
						type="button"
						onClick={() => createDraft(props.form.title, props.form.videoFile)}
					>
						Create project
					</Button>
				)}
			</div>
		</FormSection>
	);
}

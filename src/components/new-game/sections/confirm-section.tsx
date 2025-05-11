"use client";

import FormSection from "@/components/form-section";
import { NewGameFormSectionProps } from "@/types/form-section";
import { GameDraft } from "@/types/model/game-draft";
import { S3Uploader } from "@/utils/s3-uploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ConfirmSection(props: NewGameFormSectionProps) {
	const [isComplete, setIsComplete] = useState(false);
	const s3Uploader = new S3Uploader();
	const router = useRouter();

	const uploadVideo = async (videoFile: File) => {
		try {
			const ext = videoFile.name.substring(videoFile.name.indexOf("."));

			await s3Uploader.handleUpload(props.form.title + ext, videoFile);
			setIsComplete(true);
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	// upload form data to ddb
	const createDraft = async (title: string, videoFile: File) => {
		try {
			const isTeamGame = ["2v2", "3v3", "4v4"].includes(props.form.type);
			const ext = videoFile.name.substring(videoFile.name.indexOf("."));

			const res = await fetch(`/api/ddb/game-drafts`, {
				method: "PUT",
				body: JSON.stringify({
					...props.form,
					bucketKey: title + ext,

					// override optional attributes based on game type
					team1: isTeamGame ? props.form.team1 : undefined,
					team2: isTeamGame ? props.form.team2 : undefined,
					players: isTeamGame ? undefined : props.form.players,
				} as GameDraft),
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
					<button
						type="button"
						onClick={() => createDraft(props.form.title, props.videoFile!)}
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

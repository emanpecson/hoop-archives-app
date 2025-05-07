"use client";

import FormSection from "@/components/form-section";
import { NewGameFormSectionProps } from "@/types/form-section";
import { S3Uploader } from "@/utils/s3-uploader";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConfirmSection(props: NewGameFormSectionProps) {
	const [isComplete, setIsComplete] = useState(false);
	const s3Uploader = new S3Uploader();

	const handleUpload = async (videoFile: File) => {
		try {
			await s3Uploader.handleUpload(videoFile);
			setIsComplete(true);
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	useEffect(() => {
		if (props.videoFile) {
			handleUpload(props.videoFile);
		}
	}, [props.videoFile]);

	return (
		<FormSection {...props} handleSubmit={undefined}>
			{isComplete && props.videoFile ? (
				<Link href={`/video-clipper/${props.videoFile.name}`}>video</Link>
			) : (
				<p>Loading...</p>
			)}
		</FormSection>
	);
}

"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { useEffect, useRef, useState } from "react";
import { newGameSections } from "@/data/sections";
import { NewGameFormSection } from "@/types/form-section";
import { S3Uploader } from "@/utils/s3-uploader";
import { toast } from "sonner";
import { Progress } from "../ui/progress";
import { generateId } from "@/utils/generate-id";

interface NewGameDialogProps {
	children: React.ReactNode;
}

const enum UploadStatus {
	IDLE = "idle",
	PREPARING = "preparing",
	READY = "ready",
	FAILED = "failed",
}

export default function NewGameDialog(props: NewGameDialogProps) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(0);
	const [newGameForm, setNewGameForm] = useState({});
	const [videoFile, setVideoFile] = useState<File | null>(null);

	const [progress, setProgress] = useState(0);
	const s3Uploader = new S3Uploader();
	const draftId = generateId("draft");
	const bucketKey = useRef<string>("");
	const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveData = (formData: any) => {
		console.log("form data:", formData);
		if (formData) {
			setNewGameForm((prevForm) => ({ ...prevForm, ...formData }));
		} else {
			console.log("Error: Missing form data");
		}
	};

	const handleOpenChange = (open: boolean) => {
		// reset
		if (!open) {
			setStep(0);
			setNewGameForm({});
		}
		setOpen(open);
	};

	const s3Upload = async (key: string, vid: File) => {
		try {
			setStatus(UploadStatus.PREPARING);
			setProgress(0);

			// 35 MB part size (i.e. 1-2 GB upload -> ~45-60 parts)
			const partSize = 30 * 1024 * 1024;

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
			setStatus(UploadStatus.READY);
		} catch (error) {
			console.log(error);
			setStatus(UploadStatus.FAILED);
			toast.error("Failed to upload video");
		}
	};

	useEffect(() => {
		const handleUpload = async () => {
			const vid: File | null = videoFile;

			if (vid) {
				const fileExtension = vid.name.substring(vid.name.indexOf("."));

				bucketKey.current = draftId + fileExtension;
				s3Upload(bucketKey.current, vid);
			}
		};

		handleUpload();

		// * only initiate upload on vid
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [videoFile]);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Game</DialogTitle>
					<DialogDescription>Setup game details and players</DialogDescription>
				</DialogHeader>

				{newGameSections.map((section: NewGameFormSection, i: number) => (
					<section.component
						key={i}
						active={section.step === step}
						step={step}
						setStep={setStep}
						sections={newGameSections}
						saveData={handleSaveData}
						form={newGameForm}
						progress={progress}
						setVideoFile={setVideoFile}
						draftId={draftId}
						bucketKey={bucketKey.current}
					/>
				))}

				<DialogFooter>
					<div className="text-sm flex flex-col space-y-2 w-full">
						<label className="capitalize">
							{`Video status: ${status} (${(progress * 100).toFixed(0)}%)`}
						</label>

						{progress !== 1 && <Progress value={progress * 100} />}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

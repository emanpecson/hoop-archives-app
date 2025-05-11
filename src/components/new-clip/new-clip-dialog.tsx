import { ClipTime } from "@/types/clip-time";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { newClipSections } from "@/data/sections";
import { NewClipFormSection } from "@/types/form-section";
import { useState } from "react";
import { ClipDetails } from "@/types/clip-details";
import { GameDraft } from "@/types/model/game-draft";

interface NewClipDialogProps {
	open: boolean;
	clipTime: ClipTime;
	videoSource: string;
	draft: GameDraft;
	onClipCreate: (clipDetails: ClipDetails) => void;
	onClose: (flag: boolean) => void;
}

export default function NewClipDialog(props: NewClipDialogProps) {
	const [step, setStep] = useState(0);
	const [newClipForm, setNewClipForm] = useState({});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSaveData = (formData: any) => {
		console.log("form data:", formData);
		if (formData) {
			setNewClipForm((prevForm) => ({ ...prevForm, ...formData }));
		} else {
			console.log("Error: Missing form data");
		}
	};

	const handleClose = (flag: boolean) => {
		setStep(0);
		props.onClose(flag);
	};

	return (
		<Dialog open={props.open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>New Clip</DialogTitle>
					<DialogDescription>Setup clip details</DialogDescription>
				</DialogHeader>

				{newClipSections.map((section: NewClipFormSection, i: number) => (
					<section.component
						key={i}
						active={section.step === step}
						step={step}
						setStep={setStep}
						sections={newClipSections}
						saveData={handleSaveData}
						form={newClipForm}
						clipTime={props.clipTime}
						videoSource={props.videoSource}
						onClipCreate={props.onClipCreate}
						draft={props.draft}
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

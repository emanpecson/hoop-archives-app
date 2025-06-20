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
import { ClipDraft } from "@/types/clip-draft";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ClipDraftFormFields,
	clipDraftSchema,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import { useForm } from "react-hook-form";

interface NewClipDialogProps {
	open: boolean;
	clipTime: ClipTime;
	onClipCreate: (clip: ClipDraft) => void;
	onClose: (flag: boolean) => void;
}

export default function NewClipDialog(props: NewClipDialogProps) {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ClipDraftFormFields>({
		resolver: zodResolver(clipDraftSchema),
		defaultValues: { play: "offense", pointsAdded: 1 },
	});

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
						onClipSubmit={props.onClipCreate}
						// * hook form data
						control={control}
						handleSubmit={handleSubmit}
						setValue={setValue}
						watch={watch}
						errors={errors}
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

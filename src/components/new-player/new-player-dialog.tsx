import { Dispatch, SetStateAction, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { FormSection } from "@/types/form-section";
import { newPlayerSections } from "@/data/sections";

interface NewPlayerDialogProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function NewPlayerDialog(props: NewPlayerDialogProps) {
	const [step, setStep] = useState(0);
	const [newGameForm, setNewGameForm] = useState({});

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
		props.setOpen(open);
	};

	return (
		<Dialog open={props.open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Player</DialogTitle>
					<DialogDescription>Add a new player to your league</DialogDescription>
				</DialogHeader>

				{newPlayerSections.map((section: FormSection, i: number) => (
					<section.component
						key={i}
						active={section.step === step}
						step={step}
						setStep={setStep}
						sections={newPlayerSections}
						saveData={handleSaveData}
						form={newGameForm}
						onClose={() => handleOpenChange(false)}
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

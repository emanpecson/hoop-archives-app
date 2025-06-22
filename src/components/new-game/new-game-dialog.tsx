import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { newGameSections } from "@/data/sections";
import { NewGameFormSection } from "@/types/form-section";

interface NewGameDialogProps {
	videoFile: File | null;
	open: boolean;
}

export default function NewGameDialog(props: NewGameDialogProps) {
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

	return (
		<Dialog open={props.open}>
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
						videoFile={props.videoFile} // extended
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

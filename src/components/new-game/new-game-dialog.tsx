import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { newGameSections } from "@/data/sections";
import { FormSection } from "@/types/form-section";

export default function NewGameDialog() {
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

		console.log("Saved invoice:", newGameForm);
	};

	return (
		<Dialog open>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Game</DialogTitle>
					<DialogDescription>Setup game details and players</DialogDescription>
				</DialogHeader>

				{newGameSections.map((section: FormSection, i: number) => (
					<section.component
						key={i}
						active={section.step === step}
						step={step}
						setStep={setStep}
						sections={newGameSections}
						saveData={handleSaveData}
						form={newGameForm}
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

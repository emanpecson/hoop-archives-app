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

	const handleSaveData = () => {};

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
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { newGameSections } from "@/data/sections";
import { NewGameFormSection } from "@/types/form-section";

interface NewGameDialogProps {
	children: React.ReactNode;
}

export default function NewGameDialog(props: NewGameDialogProps) {
	const [open, setOpen] = useState(false);
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
		setOpen(open);
	};

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
					/>
				))}
			</DialogContent>
		</Dialog>
	);
}

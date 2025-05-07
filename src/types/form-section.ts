/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, JSX, SetStateAction } from "react";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";

export interface FormSectionProps {
	active: boolean;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	sections: FormSection[] | NewGameFormSection[];
	children?: React.ReactNode;
	handleSubmit?: (
		onValid: SubmitHandler<any>,
		onInvalid?: SubmitErrorHandler<any> | undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	saveData: (data: any) => void;
	form: any;
}

export interface FormSection {
	component: (props: FormSectionProps) => JSX.Element;
	label: string;
	step: number;
}

export interface NewGameFormSectionProps
	extends Omit<FormSectionProps, "sections"> {
	videoFile: File | null;
	sections: NewGameFormSection[];
}

export interface NewGameFormSection {
	component: (props: NewGameFormSectionProps) => JSX.Element;
	label: string;
	step: number;
}

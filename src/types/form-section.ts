/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, JSX, SetStateAction } from "react";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { ClipTime } from "./clip-time";
import { ClipDraft } from "./clip-draft";

// base form props
export interface FormSectionProps {
	active: boolean;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	sections: FormSection[] | NewGameFormSection[] | NewClipFormSection[];
	children?: React.ReactNode;
	handleSubmit?: (
		onValid: SubmitHandler<any>,
		onInvalid?: SubmitErrorHandler<any> | undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	saveData: (data: any) => void;
	form: any;
	disableNavigation?: boolean;
	onClose?: () => void;
}

export interface FormSection {
	component: (props: FormSectionProps) => JSX.Element;
	label: string;
	step: number;
}

// ----------------------------------------------------- //

// override sections + include video file
export interface NewGameFormSectionProps
	extends Omit<FormSectionProps, "sections"> {
	sections: NewGameFormSection[];
	progress: number;
	draftId: string;
	bucketKey: string;
	setVideoFile: Dispatch<SetStateAction<File | null>>;
}

// override component
export interface NewGameFormSection extends Omit<FormSection, "component"> {
	component: (props: NewGameFormSectionProps) => JSX.Element;
}

// ----------------------------------------------------- //

// override sections + include clip time + video source url
export interface NewClipFormSectionProps
	extends Omit<FormSectionProps, "sections"> {
	clipTime: ClipTime;
	sections: NewClipFormSection[];
	onClipSubmit: (clip: ClipDraft) => void;
}

// override component
export interface NewClipFormSection extends Omit<FormSection, "component"> {
	component: (props: NewClipFormSectionProps) => JSX.Element;
}

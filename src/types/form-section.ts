import { FormSectionProps } from "@/components/form-section";
import { JSX } from "react";

export interface FormSection {
	component: (props: FormSectionProps) => JSX.Element;
	label: string;
	step: number;
}

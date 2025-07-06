import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { FormSection, FormSectionProps } from "@/types/form-section";

export default function FormSection(props: FormSectionProps) {
	// save data and proceed to the next step
	const onNext = props.handleSubmit
		? props.handleSubmit(
				(data) => {
					console.log("data:", data);
					props.saveData(data);
					props.setStep(props.step + 1);
				},
				(errors) => console.log("Error:", errors)
		  )
		: () => props.setStep(props.step + 1);

	return (
		<form
			className={cn(!props.active && "hidden", "space-y-4")}
			onSubmit={onNext}
		>
			{/* header */}
			{props.sections.length > 0 && (
				<div className="flex justify-between w-full px-2">
					{props.sections.map((section, i: number) => {
						const isActive = section.step === props.step;
						return (
							<div
								key={i}
								className={cn(
									"flex space-x-1 pointer-events-none text-sm",
									isActive ? "text-white" : "text-white/25"
								)}
							>
								<span>{section.step + 1}.</span>
								<span>{section.label}</span>
							</div>
						);
					})}
				</div>
			)}

			<hr className="border-neutral-800" />

			<div className="space-y-4">{props.children}</div>

			<hr className="border-neutral-800" />

			{/* footer */}
			{props.sections.length > 0 && (
				<div className="flex justify-between place-items-center w-full">
					<Button
						type="button"
						size="sm"
						disabled={props.step === 0}
						onClick={() => props.setStep(props.step - 1)}
					>
						<ChevronLeftIcon />
						<span>Back</span>
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={
							props.step === props.sections.length - 1 ||
							props.disableNavigation
						}
						onClick={onNext}
					>
						<span>Next</span>
						<ChevronRightIcon />
					</Button>
				</div>
			)}
		</form>
	);
}

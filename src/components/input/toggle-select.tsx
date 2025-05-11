import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToggleSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: string[];
}

export default function ToggleSelect(props: ToggleSelectProps) {
	const [value, setValue] = useState(props.value);

	const handleSelect = (option: string) => {
		props.onChange(option);
		setValue(option);
	};

	return (
		<div className="w-full min-w-0 rounded-md outline-none disabled:opacity-50 text-sm bg-input-background/70 border border-input-border font-medium place-items-center inset-shadow-sm inset-shadow-input-border/40 h-9">
			<div className="flex gap-0.5 w-full h-full place-items-center p-0.5">
				{props.options.map((option, i) => (
					<button
						type="button"
						key={i}
						className={cn(
							"w-full h-full border rounded-md cursor-pointer border-neutral-900 duration-150",
							value === option
								? "text-white bg-neutral-800 inset-shadow-sm inset-shadow-neutral-700/60"
								: "text-input-muted bg-none hover:text-white"
						)}
						onClick={() => handleSelect(option)}
					>
						{option}
					</button>
				))}
			</div>
		</div>
	);
}

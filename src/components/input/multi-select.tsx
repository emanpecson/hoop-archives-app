import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";

interface MultiSelectProps {
	Icon: LucideIcon;
	options: string[];
	placeholder: string;
	error?: boolean;
	onChange: (options: string[]) => void;
}

export default function MultiSelect(props: MultiSelectProps) {
	const [open, setOpen] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [triggerWidth, setTriggerWidth] = useState<number | undefined>();

	// append (or remove) on list of players
	const handleSelect = (value: string) => {
		setSelectedOptions((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
		);
	};

	useEffect(() => {
		props.onChange(selectedOptions);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedOptions]);

	useEffect(() => {
		if (open && triggerRef.current) {
			setTriggerWidth(triggerRef.current.offsetWidth);
		}
	}, [open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant="input"
					role="combobox"
					className={cn(
						cn(
							"relative justify-start h-fit min-h-9",
							props.error
								? "text-error-foreground border border-error-foreground/50"
								: selectedOptions.length > 0
								? "text-white"
								: "text-input-muted"
						)
					)}
				>
					<props.Icon className="absolute left-3.5 top-2.5" />
					<span className={cn("pl-7.5 pr-5 text-wrap text-left")}>
						{selectedOptions.length > 0
							? selectedOptions.join(", ")
							: props.placeholder}
					</span>
					<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 absolute right-3 top-2.5 text-input-muted" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="p-0" style={{ width: triggerWidth }}>
				<Command>
					<CommandList>
						<CommandGroup>
							{props.options.map((option, i) => (
								<CommandItem
									key={i}
									value={option}
									onSelect={() => handleSelect(option)}
								>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											selectedOptions.includes(option)
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{option}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

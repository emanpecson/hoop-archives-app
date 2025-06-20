"use client";

import { CheckIcon, ChevronsUpDown, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";

interface ComboboxProps {
	Icon: LucideIcon;
	value: string | string[];
	onChange: (value: string | string[]) => void;
	options: string[];
	placeholder: string;
	error?: boolean;
	multiselect?: boolean;
}

export function Combobox(props: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(
		props.value
			? Array.isArray(props.value)
				? props.value.reduce((acc, x) => acc + `${x},`, "")
				: props.value
			: ""
	);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [triggerWidth, setTriggerWidth] = useState<number | undefined>();

	const handleSetValue = (value: string) => {
		if (props.multiselect) {
			const commaSeparatedValue = value + ",";
			setValue((currValues) =>
				currValues.includes(commaSeparatedValue)
					? currValues.replace(commaSeparatedValue, "")
					: `${currValues}${commaSeparatedValue}`
			);
		} else {
			setValue((currValue) => (value === currValue ? "" : value));
			setOpen(false);
		}
	};

	const isSelected = (option: string) => {
		return props.multiselect ? value.includes(option) : option === value;
	};

	const displayValue = () => {
		if (props.multiselect) {
			const valueArray = value.split(",");
			return (
				<div className="gap-x-1.5 flex flex-wrap">
					{valueArray.map((x, i) => (
						<span key={i}>{x}</span>
					))}
				</div>
			);
		}
		return <span>{value}</span>;
	};

	useEffect(() => {
		if (props.multiselect) {
			const valueArray = value.split(",");
			props.onChange(valueArray.slice(0, valueArray.length - 1));
		} else {
			props.onChange(value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

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
								: value
								? "text-white"
								: "text-input-muted"
						)
					)}
				>
					<props.Icon className="absolute left-3.5 top-2.5" />
					<span
						className={cn(
							"pl-7.5 pr-5",
							props.error
								? "text-error-foreground"
								: value
								? "text-white"
								: "text-input-muted"
						)}
					>
						{value ? displayValue() : props.placeholder}
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 absolute right-3 top-2.5 text-input-muted" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" style={{ width: triggerWidth }}>
				<Command>
					<CommandInput placeholder={props.placeholder} />
					<CommandList>
						<CommandEmpty>Nothing found</CommandEmpty>
						<CommandGroup>
							{props.options.map((option, i) => (
								<CommandItem
									key={i}
									value={option}
									onSelect={() => handleSetValue(option)}
								>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											isSelected(option) ? "opacity-100" : "opacity-0"
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

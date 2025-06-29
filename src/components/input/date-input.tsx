"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateInputProps {
	value?: Date | undefined;
	onChange?: (date: Date | undefined) => void;
	error?: boolean;
	placeholder?: string;
}

export default function DateInput(props: DateInputProps) {
	const handleSelect = (date?: Date) => {
		if (props.onChange) {
			console.log("prop:", props.value, date);
			props.onChange(
				props.value?.toDateString() === date?.toDateString() ? undefined : date
			);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="relative">
					<CalendarIcon
						className={cn(
							"absolute top-2 left-3",
							props.error ? "text-error-foreground" : "text-input-muted"
						)}
						size={20}
					/>
					<Button
						type="button"
						size="md"
						variant="input"
						className={cn(props.error && "border border-error-foreground/50")}
					>
						<span
							className={cn(
								"absolute left-10",
								props.error
									? "text-error-foreground"
									: props.value
									? "text-white"
									: "text-input-muted"
							)}
						>
							{props.value
								? format(props.value, "PPP")
								: props.placeholder || "Select date..."}
						</span>
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<Calendar mode="single" onSelect={handleSelect} initialFocus />
			</PopoverContent>
		</Popover>
	);
}

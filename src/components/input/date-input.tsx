"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateInputProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	error?: boolean;
}

export default function DateInput(props: DateInputProps) {
	const handleSelect = (date?: Date) => {
		if (props.onChange) props.onChange(date);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="relative">
					<CalendarIcon
						className={cn(
							"absolute top-2 left-3",
							props.error ? "text-input-error" : "text-input-muted"
						)}
						size={20}
					/>
					<Button
						type="button"
						size="md"
						variant="input"
						className={cn(props.error && "border border-input-error/50")}
					>
						<span
							className={cn(
								"absolute left-10",
								props.error
									? "text-input-error"
									: props.value
									? "text-white"
									: "text-input-muted"
							)}
						>
							{props.value ? format(props.value, "PPP") : "Select date..."}
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

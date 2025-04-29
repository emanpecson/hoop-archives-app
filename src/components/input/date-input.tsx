"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateInputProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
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
						className="absolute top-2 left-3 text-input-muted"
						size={20}
					/>
					<Button size="default" variant="input">
						<span className="absolute left-10 text-input-muted">
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

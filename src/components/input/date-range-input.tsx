import DateInput from "./date-input";

type DateRange = {
	start?: Date;
	end?: Date;
};

interface DateInputProps {
	value?: DateRange;
	onChange: (dates: DateRange) => void;
	error?: boolean;
	placeholder?: string;
}

export default function DateRangeInput(props: DateInputProps) {
	return (
		<div className="flex w-full rounded-md overflow-clip">
			<DateInput
				className="rounded-none rounded-l-md"
				value={props.value ? props.value.start : undefined}
				onChange={(newDate) =>
					props.onChange({ start: newDate, end: props.value?.end })
				}
				error={!!props.error}
			/>
			<DateInput
				className="rounded-none rounded-r-md"
				value={props.value ? props.value.end : undefined}
				onChange={(newDate) =>
					props.onChange({ start: props.value?.start, end: newDate })
				}
				error={!!props.error}
			/>
		</div>
	);
}

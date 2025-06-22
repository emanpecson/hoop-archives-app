import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	onDebounce?: (value: string) => void;
	debounceTimeout?: number;
	placeholder?: string;
	Icon: LucideIcon;
	error?: boolean;
}

export default function DebouncedInput(props: SearchInputProps) {
	const [debouncedValue, setDebouncedValue] = useState(props.value);
	const debounce = useDebounce(debouncedValue, props.debounceTimeout || 300);

	const handleChange = (value: string) => {
		props.onChange(value);
		setDebouncedValue(value);
	};

	useEffect(() => {
		if (props.onDebounce) props.onDebounce(debouncedValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounce]);

	return (
		<Input
			Icon={props.Icon}
			onChange={(ev) => handleChange(ev.target.value)}
			value={props.value}
			autoComplete="off"
			placeholder={props.placeholder ?? "Search..."}
			error={props.error}
		/>
	);
}

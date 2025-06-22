/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export function useDebounce(value: any, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [value, delay]);

	return debouncedValue;
}

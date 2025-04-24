import { useEffect } from "react";

export default function useKeyboardShortcut(
	{ key }: { key: string },
	callback: () => void
) {
	useEffect(() => {
		const handleKeyDown = (ev: KeyboardEvent) => {
			const isModifierPressed = ev.ctrlKey;
			if (ev.key === key && isModifierPressed) {
				ev.preventDefault();
				callback();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		// cleanup
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [key, callback]);
}

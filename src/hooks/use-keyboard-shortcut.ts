import { useEffect } from "react";

export default function useKeyboardShortcut(
  { key, useModifierKey }: { key: string; useModifierKey: boolean },
  callback: () => void
) {
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      console.log("ev key:", JSON.stringify(ev.key));
      const isModifierPressed = ev.metaKey || !useModifierKey;
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

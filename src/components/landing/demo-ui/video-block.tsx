import { cn } from "@/lib/utils";
import { FilmIcon } from "lucide-react";

export default function VideoBlock() {
	return (
		<div
			className={cn(
				"rounded-xl border min-w-52 h-28 flex place-items-center justify-center inset-shadow-sm",
				"border-input-border inset-shadow-neutral-600/60 bg-[#161616]"
			)}
		>
			<FilmIcon className="text-neutral-600" />
		</div>
	);
}

import { cn } from "@/lib/utils";
import { FilmIcon } from "lucide-react";

export default function ClipsBlock() {
	return (
		<div
			className={cn(
				"min-w-52 h-28 flex place-items-center justify-center space-x-1.5"
			)}
		>
			{new Array(3).fill(0).map((_, i) => (
				<div
					key={i}
					className={cn(
						"rounded-none first:rounded-l-xl last:rounded-r-xl",
						"border flex justify-center place-items-center w-full h-full inset-shadow-sm",
						"border-input-border inset-shadow-neutral-600/60 bg-[#161616]"
					)}
				>
					<FilmIcon />
				</div>
			))}
		</div>
	);
}

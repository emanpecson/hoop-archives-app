import Link from "next/link";
import { Button } from "./ui/button";

interface EmptyPromptProps {
	text: string;
	goBackUrl?: string;
}

export default function EmptyPrompt(props: EmptyPromptProps) {
	return (
		<div className="w-full h-1/2 flex flex-col justify-center place-items-center text-neutral-400">
			<p className="text-2xl">🏀 🚫</p>
			<p className="font-medium text-base">{props.text}</p>
			{props.goBackUrl && (
				<Button variant="input" className="w-fit mt-3">
					<Link href={props.goBackUrl || "/"}>Go back</Link>
				</Button>
			)}
		</div>
	);
}

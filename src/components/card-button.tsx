import { cn } from "@/lib/utils";

interface CardButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}

export default function CardButton(props: CardButtonProps) {
	return (
		<button
			onClick={props.onClick}
			disabled={props.disabled}
			className={cn(
				"text-left block w-full rounded-lg p-3 outline-none disabled:opacity-50 text-sm bg-input-background hover:bg-input-background/70 duration-150 cursor-pointer border border-input-border place-items-center disabled:pointer-events-none inset-shadow-sm inset-shadow-input-border/60",
				props.className
			)}
		>
			{props.children}
		</button>
	);
}

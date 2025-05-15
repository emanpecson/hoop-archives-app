interface CardButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
}

export default function CardButton(props: CardButtonProps) {
	return (
		<button
			onClick={props.onClick}
			disabled={props.disabled}
			className="text-left block w-full rounded-md p-3 outline-none disabled:opacity-50 text-sm bg-input-background hover:bg-input-background/70 duration-150 cursor-pointer border border-input-border place-items-center disabled:pointer-events-none inset-shadow-sm inset-shadow-input-border/60"
		>
			{props.children}
		</button>
	);
}

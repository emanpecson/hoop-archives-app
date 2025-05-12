interface CardButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
}

export default function CardButton(props: CardButtonProps) {
	return (
		<button
			onClick={props.onClick}
			className="text-left block w-full rounded-md p-3 outline-none disabled:opacity-50 text-sm bg-input-background border border-input-border place-items-center disabled:pointer-events-none inset-shadow-sm inset-shadow-input-border/60"
		>
			{props.children}
		</button>
	);
}

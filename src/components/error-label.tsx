interface ErrorLabelProps {
	text: string;
}

export default function ErrorLabel(props: ErrorLabelProps) {
	return (
		<p className="text-red-400 px-2 bg-red-700/10 rounded-md border border-red-700/20">
			{props.text}
		</p>
	);
}

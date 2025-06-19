type LabelInput = {
	label: string;
	input: React.ReactNode;
};

interface FormatInputGroupProps {
	labelInputs: LabelInput[];
}

export default function FormatInputGroup(props: FormatInputGroupProps) {
	return (
		<div className="grid grid-cols-3">
			{props.labelInputs.map((labelInput, i) => (
				<div className="contents space-x-8 space-y-8" key={i}>
					<label className="col-span-1 text-right">{labelInput.label}</label>
					<div className="col-span-2 w-full">{labelInput.input}</div>
				</div>
			))}
		</div>
	);
}

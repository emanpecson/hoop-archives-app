import { TagIcon } from "lucide-react";
import { Combobox } from "./combobox";
import { ClipTag } from "@/types/enum/clip-tag";

interface TagsComboboxProps {
	value: string[];
	onChange: (value: string | string[]) => void;
	error?: boolean;
}

export default function TagsCombobox(props: TagsComboboxProps) {
	return (
		<Combobox
			value={props.value}
			onChange={props.onChange}
			Icon={TagIcon}
			options={Object.values(ClipTag)}
			placeholder="Search tags"
			error={props.error}
			multiselect
		/>
	);
}

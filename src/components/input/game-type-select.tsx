import { SwordsIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { GameType } from "@/types/enum/game-type";
import { useState } from "react";

interface GameTypeSelectProps {
	error?: boolean;
	value: string;
	onChange: (value: string) => void;
}

export default function GameTypeSelect(props: GameTypeSelectProps) {
	const [placeholder, setPlaceholder] = useState<string | null>(
		"Select game type"
	);

	const handleSelect = (value: string) => {
		setPlaceholder(null);
		props.onChange(value);
	};

	return (
		<Select onValueChange={handleSelect} value={props.value}>
			<SelectTrigger
				Icon={SwordsIcon}
				error={props.error}
				placeholder={placeholder}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Game type</SelectLabel>
					{Object.entries(GameType).map((x) => (
						<SelectItem key={x[0]} value={x[1]}>
							{x[1]}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

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

interface PlayerSelectProps {
	error?: boolean;
	value: string;
	onChange: (value: string) => void;
}

export default function GameTypeSelect(props: PlayerSelectProps) {
	return (
		<Select onValueChange={props.onChange} value={props.value}>
			<SelectTrigger Icon={SwordsIcon} error={props.error}>
				<SelectValue placeholder="Select a game type" />
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

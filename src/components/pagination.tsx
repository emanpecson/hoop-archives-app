import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
	onPrevious: () => void;
	onNext: () => void;
	previousDisabled?: boolean;
	nextDisabled?: boolean;
}

export default function Pagination(props: PaginationProps) {
	return (
		<div className="py-1 px-2 flex gap-1">
			<Button
				type="button"
				variant="outline"
				onClick={props.onPrevious}
				disabled={props.previousDisabled}
			>
				<ChevronLeftIcon />
			</Button>
			<Button
				type="button"
				variant="outline"
				onClick={props.onNext}
				disabled={props.nextDisabled}
			>
				<ChevronRightIcon />
			</Button>
		</div>
	);
}

import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogDivider,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
	onConfirm: () => void;
	children: React.ReactNode;
	title?: string;
	description?: string;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{props.title || "Confirm"}</DialogTitle>
					<DialogDescription>
						{props.description || "Are you sure you want to continue?"}
					</DialogDescription>

					<DialogDivider />

					<DialogFooter>
						<DialogClose>
							<Button type="button" variant="input" size="sm" className="w-fit">
								Cancel
							</Button>
						</DialogClose>

						<Button
							type="button"
							variant="input"
							size="sm"
							className="w-fit"
							onClick={props.onConfirm}
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

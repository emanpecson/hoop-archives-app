import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

interface ConfirmDialogProps {
	onConfirm: () => void;
	children: React.ReactNode;
	confirmPrompt?: string;
	title?: string;
	description?: string;
	loading?: boolean;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
	const [open, setOpen] = useState(false);

	const handleClose = (flag: boolean) => {
		if (!props.loading) {
			setOpen(flag);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{props.title || "Confirm"}</DialogTitle>
					<DialogDescription>
						{props.description || "Are you sure you want to continue?"}
					</DialogDescription>

					<DialogFooter>
						<div className="w-full flex justify-end space-x-2">
							<DialogClose asChild>
								<Button
									type="button"
									variant="input"
									size="sm"
									className="w-fit"
									disabled={props.loading}
								>
									Cancel
								</Button>
							</DialogClose>

							<Button
								type="button"
								variant="input"
								size="sm"
								className="w-fit"
								onClick={props.onConfirm}
								disabled={props.loading}
							>
								{props.loading && (
									<Loader2Icon className="animate-spin" strokeWidth={1.5} />
								)}
								<span>{props.confirmPrompt ?? "Confirm"}</span>
							</Button>
						</div>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

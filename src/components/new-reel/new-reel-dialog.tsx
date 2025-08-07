import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogDivider,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
	ReelDetailsFormFields,
	reelDetailsSchema,
} from "@/types/schema/new-reel-form/reel-details-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface NewReelDialogProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	onSubmit: (data: ReelDetailsFormFields) => void;
}

export default function NewReelDialog(props: NewReelDialogProps) {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<ReelDetailsFormFields>({
		resolver: zodResolver(reelDetailsSchema),
	});

	const submitAndClose = (data: ReelDetailsFormFields) => {
		props.onSubmit(data);
		props.setOpen(false);
	};

	return (
		<Dialog open={props.open} onOpenChange={props.setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Highlight Reel</DialogTitle>
					<DialogDescription>
						Upload a new highlight reel to your league
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(submitAndClose)} className="space-y-4">
					<DialogDivider />

					<div>
						<Input
							{...register("title")}
							Icon={PencilIcon}
							error={!!errors.title}
						/>
					</div>

					<DialogDivider />

					<div className="flex justify-end w-full space-x-2">
						<DialogClose asChild>
							<Button type="button" size="sm">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" size="sm">
							Submit
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

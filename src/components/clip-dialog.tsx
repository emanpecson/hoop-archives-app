import { GameClip } from "@/types/model/game-clip";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { useRef } from "react";
import { Button } from "./ui/button";

interface ClipDialogProps {
	clip: GameClip;
	open: boolean;
	setOpen: (open: boolean) => void;
	toggleClipSelection: (clip: GameClip) => void;
	isSelected: boolean;
}

export default function ClipDialog(props: ClipDialogProps) {
	const { clip } = props;
	const videoRef = useRef<HTMLVideoElement>(null);

	const playClip = () => {
		if (videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play();
		}
	};

	return (
		<Dialog open={props.open} onOpenChange={props.setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Clip Details</DialogTitle>
					<DialogDescription>View clip details</DialogDescription>
				</DialogHeader>

				<div>
					<div className="bg-black rounded-xl overflow-clip relative">
						<video
							ref={videoRef}
							className="w-full max-h-[20rem]"
							controls
							onLoadedMetadata={playClip}
							onEnded={playClip}
						>
							<source src={clip.url} />
						</video>
					</div>

					<div></div>
				</div>

				<DialogFooter>
					<div className="w-full flex justify-end">
						<DialogClose asChild>
							<Button
								variant="input"
								className="w-fit"
								onClick={() => props.toggleClipSelection(clip)}
							>
								{props.isSelected ? "Remove clip" : "Add clip"}
							</Button>
						</DialogClose>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

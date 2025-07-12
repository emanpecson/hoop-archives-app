import { cn } from "@/lib/utils";
import { formatBytes } from "@/utils/format-bytes";
import { CheckCircle2Icon, CloudUploadIcon, FileIcon } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface FileUploaderProps {
	value: File;
	onChange: (file: File) => void;
	supportedFiles: string;
	maxSize: string;
	errorMessage?: string;
	accepts: "video" | "image";
}

export default function FileUploader(props: FileUploaderProps) {
	const [dragging, setDragging] = useState(false);
	const uploaderRef = useRef<HTMLInputElement>(null);
	const acceptsVideo = "video/*";
	const acceptsImage = "image/*";

	const handleFileChange = (
		ev: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>
	) => {
		ev.preventDefault();
		setDragging(false);

		let file: File | undefined;
		if ("dataTransfer" in ev) {
			ev.preventDefault();
			file = ev.dataTransfer.files?.[0];
		} else {
			file = ev.target.files?.[0];
		}
		if (file) props.onChange(file);
	};

	const browseFiles = () => {
		if (uploaderRef.current) uploaderRef.current.click();
	};

	const handleDragOver = (ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault();
		setDragging(false);
	};

	return (
		<>
			<input
				type="file"
				ref={uploaderRef}
				accept={props.accepts === "video" ? acceptsVideo : acceptsImage}
				onChange={handleFileChange}
				hidden
			/>

			<div className="space-y-4">
				<div
					className={cn(
						"outline-dashed outline-[3px] outline-offset-4 p-8 rounded-md",
						dragging
							? "outline-blue-500/80 bg-blue-500/10 text-blue-400"
							: "outline-neutral-700 text-neutral-600"
					)}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleFileChange}
				>
					<div className="flex flex-col justify-center place-items-center space-y-3">
						<div className="relative">
							<FileIcon size={48} strokeWidth={1} />
							<div
								className={cn(
									"absolute -bottom-1.5 -right-1 rounded-full p-1 flex justify-center place-items-center",
									dragging
										? "bg-blue-900 text-blue-400"
										: "bg-neutral-800 text-neutral-500"
								)}
							>
								<CloudUploadIcon size={16} strokeWidth={2.5} />
							</div>
						</div>
						<p className="text-sm">
							<span>Drop your file here, </span>
							<button
								className="underline underline-offset-4 text-blue-400/60 hover:text-blue-400 cursor-pointer duration-150"
								onClick={browseFiles}
								type="button"
							>
								or click to browse
							</button>
						</p>
					</div>
				</div>

				<div className="w-full flex justify-between text-sm text-neutral-600">
					<p>Supported files: {props.supportedFiles}</p>
					<p>Maximum size: {props.maxSize}</p>
				</div>

				{props.errorMessage && (
					<div className="rounded-lg bg-red-900/10 text-red-400/80 p-3 text-sm">
						{props.errorMessage}
					</div>
				)}

				{props.value && (
					<div className="rounded-lg bg-green-900/10 text-green-400/80 p-3 text-sm flex place-items-center space-x-2">
						<CheckCircle2Icon size={20} />
						<span>
							{props.value.name} ({formatBytes(props.value.size)})
						</span>
					</div>
				)}
			</div>
		</>
	);
}

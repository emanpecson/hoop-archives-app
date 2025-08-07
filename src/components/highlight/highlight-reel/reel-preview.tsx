import { UploadStatus } from "@/types/enum/upload-status";
import { Reel } from "@/types/model/reel";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ReelPreviewProps {
	reel: Reel;
}

export default function ReelPreview({ reel }: ReelPreviewProps) {
	const url =
		reel.status === UploadStatus.COMPLETE
			? `/league/${reel.leagueId}/highlight-reel/${reel.reelId}`
			: undefined;

	return (
		<div className="space-y-1">
			<div className="flex justify-center">
				{reel.status === UploadStatus.COMPLETE && reel.thumbnailUrl && url ? (
					<Link href={url}>
						<Image
							src={reel.thumbnailUrl}
							alt={`${reel.title} thumbnail`}
							width={80}
							height={40}
							className="w-80 h-40 object-cover rounded-lg"
							unoptimized
						/>
					</Link>
				) : (
					<div className="w-80 h-40 rounded-lg bg-neutral-700/50 flex justify-center place-items-center pointer-events-none">
						{reel.status === UploadStatus.UPLOADING ? (
							<Loader2Icon className="animate-spin text-neutral-500/50" />
						) : (
							<p className="text-neutral-500/50">Unavailable</p>
						)}
					</div>
				)}
			</div>

			<div className="space-y-1.5">
				<div className="font-semibold text-center text-sm">
					{url ? (
						<Link className="hover:underline" href={url}>
							{reel.title}
						</Link>
					) : (
						<p className="pointer-events-none">{reel.title}</p>
					)}
				</div>

				<div className="flex justify-center place-items-center space-x-2.5">
					<span className="rounded-lg px-2 py-0.5 bg-neutral-500/20 text-neutral-400 capitalize text-xs font-normal">
						{reel.status ?? "Unavailable"}
					</span>

					<span className="text-xs text-neutral-400">
						{new Date(reel.created).toLocaleDateString()}
					</span>
				</div>
			</div>
		</div>
	);
}

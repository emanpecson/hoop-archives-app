"use client";

import React, { useState } from "react";
import NewGameDialog from "../new-game/new-game-dialog";

export default function VideoUploader() {
	const [videoFile, setVideoFile] = useState<File | null>(null);

	const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		const vid = ev.target.files?.[0];

		if (vid) {
			throwInvalidVideo(vid);
			setVideoFile(vid);
		} else {
			throw new Error("Video not found");
		}
	};

	const throwInvalidVideo = (file: File) => {
		const MAX_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

		if (file.size > MAX_SIZE_BYTES) {
			throw new Error("Video file size exceeds the 5GB limit");
		}
	};

	return (
		<div className="flex justify-center place-items-center h-full w-full">
			{/* {videoUrl ? (
				<VideoClipper src={videoUrl} />
			) : (
				<div>
					<p>Upload video</p>
					<input type="file" accept="video/*" onChange={handleFileChange} />
				</div>
			)} */}
			<div>
				<p>Upload video</p>
				<input type="file" accept="video/*" onChange={handleFileChange} />
			</div>

			<NewGameDialog videoFile={videoFile} open={!!videoFile} />
		</div>
	);
}

"use client";

import VideoClipper from "@/components/video-clipper/video-clipper";
import React, { useState } from "react";

export default function HomePage() {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);

	const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const vid = ev.target.files?.[0];

			if (vid) {
				throwInvalidVideo(vid);

				await uploadToBucket(vid);
				const src = await getVideoSourceFromBucket(vid.name);

				setVideoUrl(src);
			} else {
				throw new Error("Video not found");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const throwInvalidVideo = (file: File) => {
		const MAX_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

		if (file.size > MAX_SIZE_BYTES) {
			throw new Error("Video file size exceeds the 5GB limit");
		}
	};

	const s3PresignedUrlEndpointBuilder = (
		filename: string,
		bucketMethod: "GET" | "PUT"
	) => {
		return `/api/s3/presigned-url?filename=${filename}&bucketMethod=${bucketMethod}`;
	};

	const uploadToBucket = async (vid: File) => {
		const bucketMethod = "PUT";

		try {
			const res = await fetch(
				s3PresignedUrlEndpointBuilder(vid.name, bucketMethod)
			);

			const { presignedUrl } = await res.json();

			const bucketPutResponse = await fetch(presignedUrl, {
				method: bucketMethod,
				headers: { "Content-Type": vid.type },
				body: vid,
			});

			if (!bucketPutResponse.ok) {
				throw new Error("Unable to process this video");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getVideoSourceFromBucket = async (filename: string) => {
		const bucketMethod = "GET";

		try {
			const res = await fetch(
				s3PresignedUrlEndpointBuilder(filename, bucketMethod)
			);

			const { presignedUrl } = await res.json();

			return presignedUrl;
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex justify-center place-items-center h-screen">
			{videoUrl ? (
				<VideoClipper src={videoUrl} />
			) : (
				<div>
					<p>Upload video</p>
					<input type="file" accept="video/*" onChange={handleFileChange} />
				</div>
			)}
		</div>
	);
}

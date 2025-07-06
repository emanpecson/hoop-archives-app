export class S3Uploader {
	public startUpload = async (key: string, vid: File, partSize: number) => {
		const res = await fetch("/api/s3/start-upload", {
			method: "POST",
			body: JSON.stringify({
				key,
				fileSize: vid.size,
				partSize,
			}),
			headers: { "Content-Type": "application/json" },
		});

		if (!res.ok) throw new Error("Failed to start upload");
		const data = await res.json();
		return data;
	};

	public uploadByParts = async (
		vid: File,
		partSize: number,
		presignedUrls: string[],
		onProgress?: (progress: number) => void
	) => {
		let count = 0;

		const uploadParts = await Promise.all(
			presignedUrls.map(async (url, i) => {
				const start = i * partSize;
				const end = Math.min(start + partSize, vid.size);
				const chunk = vid.slice(start, end);

				const res = await fetch(url, { method: "PUT", body: chunk });

				if (!res.ok) throw new Error(`Upload failed at part ${i + 1}`);

				count += 1;
				if (onProgress) onProgress(count / presignedUrls.length);

				// remove wrapped quotations
				const eTag = res.headers.get("ETag");
				return { ETag: eTag, PartNumber: i + 1 };
			})
		);

		return uploadParts;
	};

	public completeUpload = async (
		uploadId: string,
		key: string,
		parts: { ETag: string | null; PartNumber: number }[]
	) => {
		const res = await fetch("/api/s3/complete-upload", {
			method: "POST",
			body: JSON.stringify({
				uploadId,
				key,
				parts,
			}),
			headers: { "Content-Type": "application/json" },
		});

		if (!res.ok) throw new Error("Failed to complete upload");
		const data = await res.json();
		return data;
	};
}

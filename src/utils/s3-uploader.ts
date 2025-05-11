export class S3Uploader {
	public handleUpload = async (title: string, vid: File) => {
		// 10 MB part size (i.e. 5 GB upload -> ~500 parts)
		const partSize = 10 * 1024 * 1024;

		console.time("uploadTimer");

		const { uploadId, presignedUrls, key } = await this.startUpload(
			title,
			vid,
			partSize
		);
		const uploadParts = await this.uploadByParts(vid, partSize, presignedUrls);
		await this.completeUpload(uploadId, key, uploadParts);

		console.timeEnd("uploadTimer");
	};

	private startUpload = async (title: string, vid: File, partSize: number) => {
		const res = await fetch("/api/s3/start-upload", {
			method: "POST",
			body: JSON.stringify({
				title,
				fileSize: vid.size,
				partSize,
			}),
			headers: { "Content-Type": "application/json" },
		});

		if (!res.ok) throw new Error("Failed to start upload");
		const data = await res.json();
		return data;
	};

	private uploadByParts = async (
		vid: File,
		partSize: number,
		presignedUrls: string[]
	) => {
		const uploadParts = await Promise.all(
			presignedUrls.map(async (url, i) => {
				const start = i * partSize;
				const end = Math.min(start + partSize, vid.size);
				const chunk = vid.slice(start, end);

				const res = await fetch(url, { method: "PUT", body: chunk });

				if (!res.ok) throw new Error(`Upload failed at part ${i + 1}`);

				// remove wrapped quotations
				const eTag = res.headers.get("ETag");
				return { ETag: eTag, PartNumber: i + 1 };
			})
		);

		return uploadParts;
	};

	private completeUpload = async (
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

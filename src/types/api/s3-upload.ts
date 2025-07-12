export type S3StartUploadResponse = {
	uploadId: string;
	presignedUrls: string[];
};

export type S3CompleteUploadResponse = {
	location: string;
};

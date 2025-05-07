import VideoClipper from "@/components/video-clipper/video-clipper";

export default async function VideoClipperPage({
	params,
}: {
	params: Promise<{ filename: string }>;
}) {
	const { filename } = await params;
	return <VideoClipper filename={filename} />;
}

import VideoClipper from "@/components/video-clipper/video-clipper";

export default async function VideoClipperPage({
	params,
}: {
	params: Promise<{ title: string }>;
}) {
	const { title } = await params;
	return <VideoClipper title={title} />;
}

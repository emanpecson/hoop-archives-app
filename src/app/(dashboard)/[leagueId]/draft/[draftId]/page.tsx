import VideoClipper from "@/components/video-clipper/video-clipper";

export default async function DraftIdPage({
	params,
}: {
	params: Promise<{ draftId: string }>;
}) {
	const { draftId } = await params;
	return <VideoClipper draftId={draftId} />;
}

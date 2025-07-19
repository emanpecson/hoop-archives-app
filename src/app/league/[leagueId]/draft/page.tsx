import DraftsDashboard from "@/components/draft/drafts-dashboard";

export default async function DraftPage({
	params,
}: {
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;
	return <DraftsDashboard leagueId={leagueId} />;
}

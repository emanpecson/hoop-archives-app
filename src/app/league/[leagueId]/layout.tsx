import Navbar from "@/components/dashboard/navbar";

export default async function LeagueLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ leagueId: string }>;
}) {
	const { leagueId } = await params;

	return (
		<div className="flex flex-col p-4 gap-dashboard w-full h-full">
			<Navbar leagueId={leagueId} />
			<div className="w-full h-full min-h-0">{children}</div>
		</div>
	);
}

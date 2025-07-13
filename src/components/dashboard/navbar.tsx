import { PageRouter } from "@/data/routes";
import DashboardCard from "./dashboard-card";
import Link from "next/link";

interface NarbarProps {
	leagueId: string;
}

export default function Navbar(props: NarbarProps) {
	const pageRouter = new PageRouter(props.leagueId);

	return (
		<DashboardCard className="h-20 flex place-items-center px-8 space-x-8">
			<h1 className="font-bold text-2xl">Hoop Archives</h1>

			<span className="px-4 py-1 rounded-xl bg-neutral-800 text-neutral-500 font-semibold text-base">
				{props.leagueId}
			</span>

			<nav className="flex space-x-2 font-medium text-base">
				{pageRouter.getAllRoutes().map((route, i) => (
					<Link
						href={route.path}
						key={i}
						className="flex place-items-center space-x-2 px-3 py-1.5 hover:bg-neutral-800/60 text-neutral-500 hover:text-white rounded-xl duration-100"
					>
						<route.Icon size={20} />
						<span>{route.name}</span>
					</Link>
				))}
			</nav>
		</DashboardCard>
	);
}

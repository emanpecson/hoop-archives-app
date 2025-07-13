"use client";

import { PageRouter } from "@/data/routes";
import DashboardCard from "./dashboard-card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NarbarProps {
	leagueId: string;
}

export default function Navbar(props: NarbarProps) {
	const pageRouter = new PageRouter(props.leagueId);
	const pathname = usePathname();

	return (
		<DashboardCard className="h-20 flex place-items-center px-8 space-x-8">
			<h1 className="font-bold text-2xl">Hoop Archives</h1>

			<span className="px-4 py-1 rounded-xl bg-neutral-800 text-neutral-500 font-semibold text-base">
				{props.leagueId}
			</span>

			<nav className="flex space-x-2 font-medium text-base">
				{pageRouter.getAllRoutes().map((route, i) => {
					const active = pathname === route.path;
					return (
						<Link
							href={route.path}
							key={i}
							className={cn(
								"flex place-items-center space-x-2 px-3 py-1.5 rounded-xl duration-100",
								active
									? "text-white bg-neutral-800/60"
									: "hover:bg-neutral-800/60 text-neutral-500 hover:text-white"
							)}
						>
							<route.Icon size={20} />
							<span>{route.name}</span>
						</Link>
					);
				})}
			</nav>
		</DashboardCard>
	);
}

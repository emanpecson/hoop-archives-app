"use client";

import { PageRouter } from "@/lib/page-router";
import DashboardCard from "./dashboard-card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignInButton from "../auth/sign-in-button";
import { useSession } from "next-auth/react";
import { SignOutButton } from "../auth/sign-out-button";

interface NarbarProps {
	leagueId: string;
}

export default function Navbar(props: NarbarProps) {
	const { data: session } = useSession();

	const pageRouter = new PageRouter(props.leagueId, session);
	const pathname = usePathname();

	return (
		<DashboardCard className="h-20 flex justify-between place-items-center px-8">
			<div className="flex place-items-center space-x-8">
				<h1 className="font-bold text-2xl">Hoop Archives</h1>

				<span className="px-4 py-1 rounded-xl bg-neutral-800 text-neutral-500 font-semibold text-base">
					{props.leagueId}
				</span>

				<nav className="flex space-x-2 font-medium text-base">
					{pageRouter.getAccessibleRoutes().map((route, i) => {
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
			</div>

			<div className="flex place-items-center space-x-8">
				{session ? <SignOutButton session={session} /> : <SignInButton />}
			</div>
		</DashboardCard>
	);
}

"use client";

import { PageRouter } from "@/lib/page-router";
import DashboardCard from "./dashboard-card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignInButton from "../auth/sign-in-button";
import { useSession } from "next-auth/react";
import { SignOutButton } from "../auth/sign-out-button";
import AppTitle from "../app-title";

interface NarbarProps {
	leagueId: string;
}

export default function Navbar(props: NarbarProps) {
	const { data: session } = useSession();

	const pageRouter = new PageRouter(props.leagueId, session);
	const pathname = usePathname();

	return (
		<DashboardCard className="h-20 flex justify-between place-items-center px-8">
			<div className="flex place-items-center space-x-12">
				<AppTitle redirectUrl="/" />

				<nav className="flex space-x-6 font-medium text-sm">
					{pageRouter.getAccessibleRoutes().map((route, i) => {
						const active = pathname === route.path;
						return (
							<Link
								href={route.path}
								key={i}
								className={cn(
									"duration-100",
									active ? "text-white" : "text-neutral-500 hover:text-white"
								)}
							>
								<span>{route.name}</span>
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="flex place-items-center space-x-8">
				{session ? <SignOutButton /> : <SignInButton />}
			</div>
		</DashboardCard>
	);
}

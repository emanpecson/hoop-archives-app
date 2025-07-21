"use client";

import DashboardCard from "@/components/dashboard/dashboard-card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function UnauthorizedPage() {
	// const params = useSearchParams();
	// const redirectUrl = params.get("redirectUrl") || "/";

	return (
		<Suspense>
			<div className="justify-center place-items-center h-1/2 flex">
				<DashboardCard className="text-center space-y-4">
					<h2 className="font-bold text-xl">Unauthorized</h2>

					<p>You do not have the proper permissions to visit that page.</p>

					{/* <Link href={redirectUrl}>
						<Button variant="input">Return</Button>
					</Link> */}
				</DashboardCard>
			</div>
		</Suspense>
	);
}

import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import { PageRouter } from "./lib/page-router";

const isUserRole = (session: Session) => {
	const { groups } = session.user;
	return groups && groups.some((x) => x === "UserRole");
};

export default auth((req) => {
	const { pathname, origin } = req.nextUrl;

	// protect api routes
	if (pathname.startsWith("/api")) {
		if (pathname.startsWith("/api/auth")) return;

		if (!req.auth) {
			return NextResponse.json(
				{ error: "Middleware 401 - Unauthenticated" },
				{ status: 401 }
			);
		}
	}

	// protect page routes
	else {
		const signInUrl = new NextURL("/api/auth/signin", origin);
		const unauthorizedUrl = new NextURL("/unauthorized", origin);

		if (!req.auth) {
			console.log("Middleware: 401 - Unauthenticated");
			return NextResponse.redirect(signInUrl);
		}

		if (pathname !== "/unauthorized") {
			// on paths w/ a league id
			const pathSegments = pathname.split("/").slice(1);
			if (pathSegments.length >= 2 && pathSegments[0] === "league") {
				const leagueId = pathSegments[1];
				const pageRouter = new PageRouter(leagueId);

				if (
					pageRouter.containsProtectedRoutes(pathname) &&
					!isUserRole(req.auth)
				) {
					console.log("Middleware: 403 - Unauthorized (Invalid permissions)");
					return NextResponse.redirect(unauthorizedUrl);
				}
			}
		}
	}
});

// avoid execution on static images
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

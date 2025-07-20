import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PageRouter } from "./lib/page-router";
import { tokenIsExpired } from "./utils/auth/token";

export default auth((req) => {
	const { pathname, origin } = req.nextUrl;
	const signInUrl = new NextURL("/api/auth/signin", origin);

	// protect api routes
	if (pathname.startsWith("/api")) {
		if (pathname.startsWith("/api/auth")) return;

		if (!req.auth) {
			return NextResponse.json(
				{ error: "Middleware 401 - Unauthenticated" },
				{ status: 401 }
			);
		}

		// on id-token expiration or aws-cred expiration, force re-authentication
		if (tokenIsExpired(req.auth)) {
			console.log("Middleware: Token expired. Redirecting to sign-in.");
			return NextResponse.redirect(signInUrl);
		}
	}

	// protect page routes
	else {
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
				const pageRouter = new PageRouter(leagueId, req.auth);

				if (pageRouter.isViolatingRouteAccess(pathname)) {
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

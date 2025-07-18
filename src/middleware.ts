// export { auth as middleware } from "@/auth";

import { auth } from "@/auth";

export default auth((req) => {
	if (!req.auth && req.nextUrl.pathname !== "/login") {
		const login = new URL("/login", req.nextUrl.origin);
		return Response.redirect(login);
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

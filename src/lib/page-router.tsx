import { PageRoute } from "@/types/page-route";
import {
	HouseIcon,
	PaperclipIcon,
	SquareScissorsIcon,
	UsersIcon,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pageKeys = ["home", "draft", "highlightBuilder", "players"] as const;
type PageKey = (typeof pageKeys)[number];

export class PageRouter {
	leagueId: string;
	routes: Record<PageKey, PageRoute>;

	constructor(leagueId: string) {
		this.leagueId = leagueId;

		this.routes = {
			home: { name: "Home", path: `/league/${leagueId}`, Icon: HouseIcon },
			draft: {
				name: "Draft",
				path: `/league/${leagueId}/draft`,
				Icon: SquareScissorsIcon,
			},
			highlightBuilder: {
				name: "Highlight Builder",
				path: `/league/${leagueId}/highlight-builder`,
				Icon: PaperclipIcon,
			},
			players: {
				name: "Players",
				path: `/league/${leagueId}/player`,
				Icon: UsersIcon,
			},
		};
	}

	public getAllRoutes = () => {
		return Object.values(this.routes);
	};

	public getRoute = (pageKey: PageKey) => {
		return this.routes[pageKey];
	};

	public containsProtectedRoutes = (pathname: string): boolean => {
		return this.getProtectedRoutes().some((route) =>
			pathname.startsWith(route.path)
		);
	};

	private getProtectedRoutes = () => {
		return [this.routes["draft"], this.routes["players"]];
	};
}

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
			home: { name: "Home", path: `/${leagueId}`, Icon: HouseIcon },
			draft: {
				name: "Draft",
				path: `/${leagueId}/draft`,
				Icon: SquareScissorsIcon,
			},
			highlightBuilder: {
				name: "Highlight Builder",
				path: `/${leagueId}/highlight-builder`,
				Icon: PaperclipIcon,
			},
			players: {
				name: "Players",
				path: `/${leagueId}/player`,
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
}

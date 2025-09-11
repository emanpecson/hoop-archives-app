/* eslint-disable @typescript-eslint/no-unused-vars */
import { PageRoute } from "@/types/page-route";
import {
  FilmIcon,
  HouseIcon,
  PaperclipIcon,
  SquareScissorsIcon,
  UsersIcon,
} from "lucide-react";
import { Session, User } from "next-auth";

// * using this method so that I can access a specific page-route by name
const publicPageKeys = ["home", "highlightReel", "players"] as const;
type PublicPageKey = (typeof publicPageKeys)[number];

const protectedPageKeys = ["highlightBuilder", "draft"] as const;
type ProtectedPageKey = (typeof protectedPageKeys)[number];

export class PageRouter {
  private static betaRoleName: string = "BetaUser";

  private publicRoutes: Record<PublicPageKey, PageRoute>;
  private protectedRoutes: Record<ProtectedPageKey, PageRoute>;
  private isBetaUser: boolean = true;

  // * ------------------------------------------------ *

  constructor(leagueId: string, session: Session | null) {
    if (session && session.user)
      this.isBetaUser = this.checkIsBetaUser(session.user);

    this.publicRoutes = {
      home: { name: "Home", path: `/league/${leagueId}`, Icon: HouseIcon },
      highlightReel: {
        name: "Highlight Reel",
        path: `/league/${leagueId}/highlight-reel`,
        Icon: FilmIcon,
      },
      players: {
        name: "Players",
        path: `/league/${leagueId}/player`,
        Icon: UsersIcon,
      },
    };

    this.protectedRoutes = {
      highlightBuilder: {
        name: "Highlight Builder",
        path: `/league/${leagueId}/highlight-builder`,
        Icon: PaperclipIcon,
      },
      draft: {
        name: "Draft",
        path: `/league/${leagueId}/draft`,
        Icon: SquareScissorsIcon,
      },
    };
  }

  // * ------------------------------------------------ *

  public getAccessibleRoutes = (): PageRoute[] => {
    if (this.isBetaUser) return Object.values(this.publicRoutes);

    return Object.values(this.publicRoutes).concat(
      Object.values(this.protectedRoutes)
    );
  };

  public getRoute = (key: PublicPageKey | ProtectedPageKey): PageRoute => {
    if (key in this.publicRoutes) {
      return this.publicRoutes[key as PublicPageKey];
    }
    return this.protectedRoutes[key as ProtectedPageKey];
  };

  public isViolatingRouteAccess = (pathname: string): boolean => {
    return this.containsProtectedRoutes(pathname) && this.isBetaUser;
  };

  // * ------------------------------------------------ *

  private checkIsBetaUser = (user: User) => {
    const { groups } = user;

    // defualt role is beta user
    if (!groups || groups.length === 0) return true;

    // otherwise, check if user belongs in beta group
    return groups.some((x) => x === PageRouter.betaRoleName);
  };

  private containsProtectedRoutes = (pathname: string): boolean => {
    return Object.values(this.protectedRoutes).some((route) =>
      pathname.startsWith(route.path)
    );
  };
}

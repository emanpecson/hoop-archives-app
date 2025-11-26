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
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import Image from "next/image";

interface NarbarProps {
  leagueId: string;
}

export default function Navbar(props: NarbarProps) {
  const { data: session } = useSession();

  const pageRouter = new PageRouter(props.leagueId, session);
  const pathname = usePathname();
  const username =
    session && session.user.email ? session.user.email.split("@")[0] : "You";

  return (
    <DashboardCard className="sm:h-20 h-12 flex justify-between place-items-center sm:px-8 px-2 max-sm:rounded-none">
      <div className="flex place-items-center justify-between w-full">
        <AppTitle redirectUrl="/" />

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="border-none p-8 bg-neutral-900 dark:bg-neutral-900">
            <SheetTitle>Navigation</SheetTitle>

            <nav className="flex flex-col space-y-2 font-medium text-sm">
              {pageRouter.getAccessibleRoutes().map((route, i) => {
                const active = pathname === route.path;

                return (
                  <Link
                    href={route.path}
                    key={i}
                    className={cn(
                      "duration-100 flex space-x-2 text-base place-items-center",
                      active
                        ? "text-white"
                        : "text-neutral-500 hover:text-white"
                    )}
                  >
                    <route.Icon size={20} />
                    <span>{route.name}</span>
                  </Link>
                );
              })}

              <div className="border rounded-md p-2 border-input-border mt-6">
                {session ? (
                  <div className="flex place-items-center justify-between">
                    <div className="flex place-items-center gap-2">
                      {session.user.image ? (
                        <Image
                          alt="user image"
                          src={session.user.image}
                          height={24}
                          width={24}
                          className="object-cover w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-500" />
                      )}
                      <p>{username}</p>
                    </div>

                    <SignOutButton />
                  </div>
                ) : (
                  <SignInButton />
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </DashboardCard>
  );
}

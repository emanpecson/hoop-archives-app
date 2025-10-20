import { ArrowRightIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import SignInButton from "../auth/sign-in-button";

interface HeroSectionProps {
  session: Session | null;
  sessionStatus: "authenticated" | "loading" | "unauthenticated";
  demoLeaguePath: string;
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section className="w-full flex max-lg:flex-col justify-between place-items-center gap-16">
      <div className="flex flex-col justify-center place-items-start space-y-6">
        <div className="space-y-1">
          <h1 className="flex max-sm:flex-col sm:place-items-center sm:space-x-2 sm:text-5xl text-4xl font-bold">
            <span>Clip,</span>
            <span>replay,</span>
            <span className="text-highlight">highlight.</span>
            <span className="animate-bounce sm:pt-0 pt-4">🏀</span>
          </h1>

          <h2 className="font-medium sm:text-lg text-sm text-neutral-500">
            Turn homemade basketball footage into golden moments.
          </h2>
        </div>

        <div>
          {props.session ? (
            <Link href={props.demoLeaguePath}>
              <button className="duration-100 flex place-items-center gap-2 hover:translate-x-2 hover:text-highlight cursor-pointer">
                <span className="font-semibold">Demo</span>
                <ArrowRightIcon size={16} strokeWidth={3} />
              </button>
            </Link>
          ) : (
            <SignInButton disabled={props.sessionStatus === "loading"} />
          )}
        </div>
      </div>
    </section>
  );
}

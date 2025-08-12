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
			<div className="flex flex-col justify-center sm:place-items-start place-items-center space-y-6">
				<div className="space-y-1">
					<h1 className="flex place-items-center space-x-2 text-5xl font-bold">
						<span>Clip,</span>
						<span>replay,</span>
						<span className="text-highlight">highlight.</span>
						<span className="animate-bounce">🏀</span>
					</h1>

					<h2 className="font-medium text-lg text-neutral-500">
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

import { auth } from "@/auth";
import SignInButton from "@/components/auth/sign-in-button";
import { Button } from "@/components/ui/button";
import { tempLeagueId } from "@/data/temp";
import Link from "next/link";

const session = await auth();

export default function LandingPage() {
	const tempLeagueUrl = `/league/${tempLeagueId}`;

	return (
		<div className="flex flex-col justify-center place-items-center h-1/2 space-y-2">
			<div className="flex place-items-center space-x-2">
				<h1 className="text-4xl font-bold">Hoop Archives 🏀</h1>
				<p className="rounded-lg bg-neutral-800 text-neutral-400 px-2 py-0.5 text-2xl font-medium">
					Beta
				</p>
			</div>
			<h2 className="font-medium text-2xl text-neutral-500">
				Turn your basketball videos into searchable clips
			</h2>

			<div className="">
				{session ? (
					<Link href={tempLeagueUrl}>
						<Button size="lg" variant="input" className="text-lg">
							Demo
						</Button>
					</Link>
				) : (
					<SignInButton />
				)}
			</div>
		</div>
	);
}

import { auth } from "@/auth";
import SignInButton from "@/components/auth/sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";

const session = await auth();

export default function LandingPage() {
	return <div>{session ? <SignOutButton /> : <SignInButton />}</div>;
}

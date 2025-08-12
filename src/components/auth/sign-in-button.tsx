"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { tempLeagueId } from "@/data/temp";

export default function SignInButton({ disabled }: { disabled: boolean }) {
	return (
		<Button
			disabled={disabled}
			onClick={() =>
				signIn("cognito", { redirectTo: `/league/${tempLeagueId}` })
			}
		>
			Sign in
		</Button>
	);
}

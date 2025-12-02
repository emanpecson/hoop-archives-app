"use client";

import { Button } from "../ui/button";
import { tempLeagueId } from "@/data/temp";
import { authClient } from "@/lib/auth-client";

export default function SignInButton({ disabled }: { disabled?: boolean }) {
  const signIn = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "cognito",
      callbackURL: `/league/${tempLeagueId}`,
    });

    if (error) {
      console.error("Sign-in error:", error);
    } else {
      console.log("Sign-in successful:", data);
    }
  };

  return (
    <Button disabled={disabled} onClick={signIn}>
      Sign in
    </Button>
  );
}

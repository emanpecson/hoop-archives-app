"use client";

import ConfirmDialog from "../confirm-dialog";
import { Button } from "../ui/button";
import { createAuthClient } from "better-auth/client";

export function SignOutButton() {
  const authClient = createAuthClient();

  const signOut = async () => {
    const { data, error } = await authClient.signOut();

    if (error) {
      console.error("Sign-out error:", error);
    } else {
      console.log("Sign-out successful:", data);
    }
  };

  return (
    <ConfirmDialog
      title="Sign out"
      description="Are you sure you want to sign out?"
      onConfirm={signOut}
    >
      <Button className="cursor-pointer">
        <span>Sign out</span>
      </Button>
    </ConfirmDialog>
  );
}

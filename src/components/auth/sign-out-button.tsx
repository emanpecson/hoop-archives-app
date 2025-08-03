"use client";

import { signOut } from "next-auth/react";
import ConfirmDialog from "../confirm-dialog";
import { Button } from "../ui/button";
import { DoorOpenIcon } from "lucide-react";

export function SignOutButton() {
	return (
		<ConfirmDialog
			title="Sign out"
			description="Are you sure you want to sign out?"
			onConfirm={signOut}
		>
			<Button className="cursor-pointer">
				<DoorOpenIcon />
				<span>Sign out</span>
			</Button>
		</ConfirmDialog>
	);
}

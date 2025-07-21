"use client";

import { signOut } from "next-auth/react";
import ConfirmDialog from "../confirm-dialog";
import { Session } from "next-auth";
import Image from "next/image";
import { Button } from "../ui/button";

interface SignOutButtonProps {
	session: Session;
}

export function SignOutButton(props: SignOutButtonProps) {
	return (
		<ConfirmDialog
			title="Sign out"
			description="Are you sure you want to sign out?"
			onConfirm={signOut}
		>
			<Button className="flex space-x-2 place-items-center cursor-pointer">
				<Image
					src={props.session.user.image || "/user-placeholder.png"}
					alt="user-image"
					width={32}
					height={32}
					className="object-cover rounded-full w-9 h-9 border border-neutral-600"
					unoptimized
				/>
				<span>Sign out</span>
			</Button>
		</ConfirmDialog>
	);
}

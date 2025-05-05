import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface CustomInputProps extends React.ComponentProps<"input"> {
	Icon: LucideIcon;
	error?: boolean;
}

function Input({ className, type, Icon, error, ...props }: CustomInputProps) {
	return (
		<div className="relative">
			<Icon
				className={cn(
					"absolute top-2 left-3",
					error ? "text-red-300" : "text-input-muted"
				)}
				size={20}
			/>
			<input
				type={type}
				data-slot="input"
				className={cn(
					"flex h-9 w-full min-w-0 rounded-md px-3 py-1 outline-none disabled:pointer-events-none disabled:opacity-50",
					"focus-visible:ring-[3px] placeholder:text-input-muted",
					"text-sm bg-input-background/70 border border-input-border pl-10 font-medium inset-shadow-sm inset-shadow-input-border/40",
					error
						? "text-input-error border-input-error/50 ring-input-error/40"
						: "text-white focus-visible:border-neutral-950 focus-visible:ring-neutral-500/30",
					className
				)}
				{...props}
			/>
		</div>
	);
}

export { Input };

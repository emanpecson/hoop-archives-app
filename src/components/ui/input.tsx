import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface CustomInputProps extends React.ComponentProps<"input"> {
	Icon: LucideIcon;
}

function Input({ className, type, Icon, ...props }: CustomInputProps) {
	return (
		<div className="relative">
			<Icon className="absolute top-2 left-3 text-input-muted" size={20} />
			<input
				type={type}
				data-slot="input"
				className={cn(
					"flex h-9 w-full min-w-0 rounded-md px-3 py-1 outline-none disabled:pointer-events-none disabled:opacity-50",
					"focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 focus-visible:ring-[3px] placeholder:text-input-muted",
					"text-sm bg-input-background border-input-border pl-10 font-medium",
					className
				)}
				{...props}
			/>
		</div>
	);
}

export { Input };

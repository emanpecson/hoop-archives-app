import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

interface DashboardCardProps {
	children: React.ReactNode;
	className?: ClassValue;
}

export default function DashboardCard(props: DashboardCardProps) {
	return (
		<div
			className={cn(
				"border border-card-border bg-card-background px-5 py-4 rounded-2xl inset-shadow-sm inset-shadow-neutral-800/60",
				props.className
			)}
		>
			{props.children}
		</div>
	);
}

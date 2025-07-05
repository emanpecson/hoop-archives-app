import { Skeleton } from "@/components/ui/skeleton";

export default function HighlightClipRowSkeleton() {
	return (
		<tr>
			<td className="px-4 py-2">
				<div className="flex justify-center place-items-center">
					<Skeleton className="w-5 h-5 rounded-md" />
				</div>
			</td>
			<td className="px-4 py-2">
				<Skeleton className="w-2/3 h-5" />
			</td>
			<td className="px-4 py-2">
				<Skeleton className="w-2/3 h-5" />
			</td>
			<td className="px-4 py-2">
				<Skeleton className="w-1/3 h-5" />
			</td>
			<td className="px-4 py-2">
				<Skeleton className="w-full h-5" />
			</td>
			<td className="px-4 py-2">
				<Skeleton className="w-2/3 h-5" />
			</td>
			<td className="px-4 py-2">
				<Skeleton className="w-5 h-5" />
			</td>
		</tr>
	);
}

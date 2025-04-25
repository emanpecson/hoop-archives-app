import { ClipTime } from "@/types/clip-time";

interface ClipManagerProps {
	clips: ClipTime[];
	handleDelete: (index: number) => void;
}

export default function ClipManager(props: ClipManagerProps) {
	return (
		<div className="mt-4 space-y-1 text-sm rounded-lg border p-4">
			<p className="font-semibold">Clips:</p>
			<ul>
				{props.clips
					.filter((clip) => !!clip.end)
					.map((clip, i) => (
						<li key={i} onClick={() => props.handleDelete(i)}>
							{i + 1}.{" "}
							{clip.end !== null
								? `${clip.start.toFixed(2)}s → ${clip.end.toFixed(2)}s`
								: `Started at ${clip.start.toFixed(2)}s (no end yet)`}
						</li>
					))}
			</ul>
		</div>
	);
}

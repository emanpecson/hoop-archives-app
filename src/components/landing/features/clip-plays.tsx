import { ScissorsIcon } from "lucide-react";
import Caption from "@/components/landing/demo-ui/caption";
import DashedBridge from "../demo-ui/dashed-bridge";
import VideoBlock from "../demo-ui/video-block";
import ClipsBlock from "../demo-ui/clips-block";

export default function ClipPlays() {
	return (
		<div className="w-full flex justify-between place-items-start space-x-6">
			<p>
				Break a basketball game into clips with this simplified video editor.
				Configure data for each clip to automatically maintain game score,
				player stats, and set filterable tags.
			</p>

			<div className="w-full flex place-items-center justify-center">
				<div className="relative w-full">
					<VideoBlock />

					<div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
						<Caption heading="2 GB, 20 min." subheading="Unedited, bloated" />
					</div>
				</div>

				<DashedBridge dashes={3} icon={ScissorsIcon} />

				<div className="relative w-full">
					<ClipsBlock />

					<div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
						<Caption
							heading="500 MB, 2 min."
							subheading="Compiled clips of relevant plays"
							highlight
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

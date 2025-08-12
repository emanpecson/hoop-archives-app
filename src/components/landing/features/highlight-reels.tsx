import { CloudUploadIcon } from "lucide-react";
import Caption from "@/components/landing/demo-ui/caption";
import DashedBridge from "../demo-ui/dashed-bridge";
import VideoBlock from "../demo-ui/video-block";
import ClipsBlock from "../demo-ui/clips-block";

export default function HighlightReels() {
	return (
		<div className="w-full flex justify-between place-items-start space-x-6">
			<p>
				Build highlight compilation videos from your clips. Use filters to find
				the plays you want and share with your friends!
			</p>

			<div className="w-full flex place-items-center justify-center">
				<div className="relative w-full">
					<ClipsBlock />

					<div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
						<Caption
							heading="Assemble clips"
							subheading="Search and filter for the perfect clips"
						/>
					</div>
				</div>

				<DashedBridge dashes={3} icon={CloudUploadIcon} />

				<div className="relative w-full">
					<VideoBlock />

					<div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
						<Caption
							heading={'"My 2025 Mixtape"'}
							subheading="Upload your highlight reel"
							highlight
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

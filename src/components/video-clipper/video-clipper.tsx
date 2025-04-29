import ClipController from "./clip-controller";
import ClipDetails from "./clip-details";
import GameDetails from "./game-details";
import VideoController from "./video-controller";
import VideoPlayer from "./video-player";

export default function VideoClipper() {
	return (
		<div className="flex w-full h-full gap-dashboard">
			<div className="flex flex-col w-full h-full gap-dashboard">
				<div className="flex w-full gap-dashboard h-full">
					<ClipDetails />
					<VideoPlayer />
				</div>
				<div className="h-fit flex flex-col gap-dashboard">
					<VideoController />
					<ClipController />
				</div>
			</div>
			<GameDetails />
		</div>
	);
}

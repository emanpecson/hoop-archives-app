import { CalendarIcon, FolderPenIcon } from "lucide-react";
import DashboardCard from "../dashboard/dashboard-card";
import DashboardCardHeader from "../dashboard/dashboard-card-header";
import { Input } from "../ui/input";
import { Game } from "@/types/model/game";
import Statboard from "../video-clipper/game-details/statboard";
import { Button } from "../ui/button";
import Link from "next/link";
import { Clip } from "@/types/model/clip";

interface GameOverviewDetailsProps {
	game: Game;
	clips: Clip[];
}

export default function GameOverviewDetails(props: GameOverviewDetailsProps) {
	return (
		<DashboardCard className="h-full flex flex-col justify-between">
			<div className="space-y-4 overflow-y-auto h-full">
				<DashboardCardHeader text="Game Details" />
				<div className="space-y-2">
					<Input
						readOnly
						Icon={FolderPenIcon}
						value={props.game.title}
						className="pointer-events-none"
					/>
					<Input
						readOnly
						Icon={CalendarIcon}
						value={
							props.game
								? new Date(props.game.date).toLocaleDateString()
								: "Loading..."
						}
						className="pointer-events-none"
					/>
				</div>
				<hr className="border-neutral-800" />

				<Statboard
					label="Home Stats"
					clips={props.clips}
					players={props.game.home}
				/>

				<hr className="border-neutral-800" />

				<Statboard
					label="Away Stats"
					clips={props.clips}
					players={props.game.away}
				/>
			</div>

			<Button variant="input">
				<Link href="/">Return to games</Link>
			</Button>
		</DashboardCard>
	);
}

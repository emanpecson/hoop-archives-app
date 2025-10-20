import Caption from "../demo-ui/caption";
import Scoreboard from "../demo-ui/scoreboard";
import StatTable from "../demo-ui/stat-table";

export default function ReplayGames() {
  return (
    <div className="w-full flex justify-between place-items-start space-x-3">
      <p className="text-sm sm:text-base">
        Skip all of the misses, stream the most relevant clips of each game, and
        view overall game stats.
      </p>

      <div className="hidden w-full sm:flex place-items-end justify-center">
        <div className="relative w-full">
          <div className="flex justify-center">
            <StatTable />
          </div>

          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <Caption
              heading="Game stats"
              subheading="Access player and team stats"
              highlight
            />
          </div>
        </div>

        <div className="relative w-full">
          <div className="flex justify-center">
            <Scoreboard />
          </div>

          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <Caption
              heading="Live scoreboard"
              subheading="Score changes as the game progresses"
              highlight
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { tempLeagueId } from "@/data/temp";
import { redirect } from "next/navigation";

export default function LeaguePage() {
	redirect(`/league/${tempLeagueId}`);
}

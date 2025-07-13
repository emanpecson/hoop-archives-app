import { tempLeagueId } from "@/data/temp";
import { redirect } from "next/navigation";

export default function DashboardPage() {
	redirect(`/${tempLeagueId}`);
}

import { FolderPenIcon } from "lucide-react";
import DashboardCard from "../dashboard/dashboard-card";
import DashboardCardHeader from "../dashboard/dashboard-card-header";
import { Input } from "../ui/input";
import DateInput from "../input/date-input";

export default function GameDetails() {
	return (
		<DashboardCard className="w-72 h-full space-y-2">
			<DashboardCardHeader text="Game Details" />
			<Input Icon={FolderPenIcon} placeholder="Enter game title..." />
			<DateInput />

			<hr className="opacity-25" />
		</DashboardCard>
	);
}

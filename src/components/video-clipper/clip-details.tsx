import { SearchIcon } from "lucide-react";
import DashboardCard from "../dashboard/dashboard-card";
import DashboardCardHeader from "../dashboard/dashboard-card-header";
import { Input } from "../ui/input";

export default function ClipDetails() {
	return (
		<DashboardCard className="w-72 h-full space-y-2">
			<DashboardCardHeader text="Clip Details" />
			<Input Icon={SearchIcon} placeholder="Search clip..." />
		</DashboardCard>
	);
}

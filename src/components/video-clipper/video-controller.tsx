import DashboardCard from "../dashboard/dashboard-card";

export default function VideoController() {
	return (
		<div className="flex w-full h-24 gap-dashboard">
			<DashboardCard className="w-32">zoom</DashboardCard>
			<DashboardCard className="w-32">start clip</DashboardCard>
			<DashboardCard className="w-full">primary controller</DashboardCard>
		</div>
	);
}

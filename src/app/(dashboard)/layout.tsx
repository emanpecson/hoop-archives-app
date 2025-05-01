import Navbar from "@/components/dashboard/navbar";

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col p-4 gap-dashboard w-screen h-screen">
			<Navbar />
			<div className="w-full h-full min-h-0">{children}</div>
		</div>
	);
}

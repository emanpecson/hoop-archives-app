interface DashboardCardHeaderProps {
	text: string;
}

export default function DashboardCardHeader(props: DashboardCardHeaderProps) {
	return <h2 className="text-lg font-medium">{props.text}</h2>;
}

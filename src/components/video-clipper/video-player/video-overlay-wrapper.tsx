interface VideoOverlayWrapperProps {
	children: React.ReactNode;
}

export default function VideoOverlayWrapper(props: VideoOverlayWrapperProps) {
	return (
		<div className="rounded-xl bg-neutral-400/60 backdrop-blur-lg h-12 px-4 text-white flex space-x-4 place-items-center justify-center shrink-0 text-nowrap">
			{props.children}
		</div>
	);
}

import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

interface VideoOverlayWrapperProps {
  children: React.ReactNode;
  className?: ClassValue;
}

export default function VideoOverlayWrapper(props: VideoOverlayWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-xl sm:h-10 h-8 sm:px-3 px-2 flex space-x-4 place-items-center justify-center shrink-0",
        "bg-neutral-400/70 backdrop-blur-lg",
        "text-white text-nowrap text-shadow-xs font-semibold sm:text-sm text-xs",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

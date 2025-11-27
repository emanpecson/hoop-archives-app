"use client";

import { useGameRealtimeScore } from "@/hooks/use-realtime-score";
import { PlayTimestamp } from "@/types/model/game";
import { useRef, useState } from "react";
import VideoOverlayWrapper from "./overlay/video-overlay-wrapper";
import { cn } from "@/lib/utils";

interface GamePlayerProps {
  src: string;
  playTimestamps: PlayTimestamp[];
}

export default function GamePlayer(props: GamePlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const score = useGameRealtimeScore(props.playTimestamps, currentTime);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  return (
    <div className="h-full w-full max-sm:aspect-video rounded-2xl bg-black border border-input-border relative overflow-clip">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        className="h-full w-full object-contain"
        controls
      >
        <source src={props.src} type="video/mp4" />
      </video>

      {videoRef.current && (
        <div className={cn("absolute top-3 right-3 flex space-x-1")}>
          <VideoOverlayWrapper>{`Home: ${score.home}`}</VideoOverlayWrapper>
          <VideoOverlayWrapper>{`Away: ${score.away}`}</VideoOverlayWrapper>
        </div>
      )}
    </div>
  );
}

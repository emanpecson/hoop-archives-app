"use client";

import { useEffect, useState } from "react";
import ClipController from "./clip-controller/clip-controller";
import GameDetails from "./game-details/game-details";
import VideoController from "./video-controller/video-controller";
import DraftPlayer from "../media/draft-player";
import { ClipTime } from "@/types/clip-time";
import NewClipDialog from "../new-clip/new-clip-dialog";
import { ClipDraft } from "@/types/clip-draft";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

interface VideoClipperProps {
  draftId: string;
}

export default function VideoClipper(props: VideoClipperProps) {
  const [newClipDialogOpen, setNewClipDialogOpen] = useState(false);
  const { draft, setDraft, fetchDraft, fetchSource, sortClips, videoRef } =
    useVideoClipperStore((state) => ({
      draft: state.draft,
      setDraft: state.setDraft,
      fetchDraft: state.fetchDraft,
      fetchSource: state.fetchSource,
      sortClips: state.sortClips,
      videoRef: state.videoRef,
    }));

  // for defining further clip details
  const [newClipTime, setNewClipTime] = useState<ClipTime | null>(null);

  const handleClipTime = (clipTime: ClipTime) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setNewClipTime(clipTime);
    setNewClipDialogOpen(true);
  };

  const handleClipCreate = (newClip: ClipDraft) => {
    const sortedClips = sortClips([...draft!.clipDrafts, newClip]);
    setDraft({ ...draft!, clipDrafts: sortedClips });
    setNewClipTime(null);
  };

  useEffect(() => {
    if (props.draftId) fetchDraft(props.draftId);
  }, [props.draftId, fetchDraft]);

  useEffect(() => {
    if (draft) fetchSource(draft.bucketKey);
  }, [draft, fetchSource]);

  return (
    <>
      <div className="flex w-full h-full gap-dashboard">
        <div className="flex flex-col w-full h-full gap-dashboard min-w-0">
          <div className="flex w-full gap-dashboard h-full min-h-0">
            <DraftPlayer />
          </div>
          <div className="h-fit flex flex-col gap-dashboard">
            {draft && <VideoController onClipTime={handleClipTime} />}
            <ClipController />
          </div>
        </div>
        <GameDetails />
      </div>

      {newClipTime && draft && (
        <NewClipDialog
          open={newClipDialogOpen}
          clipTime={newClipTime}
          onClipCreate={handleClipCreate}
          onClose={setNewClipDialogOpen}
        />
      )}
    </>
  );
}

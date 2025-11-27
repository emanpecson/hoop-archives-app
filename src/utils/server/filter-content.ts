import { Clip } from "@/types/model/clip";
import { Game } from "@/types/model/game";
import { Reel } from "@/types/model/reel";

export const filterClips = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Record<string, any>[] | undefined,
  query: URLSearchParams
) => {
  let clips = items as Clip[];

  const filters = {
    play: query.get("play"),
    tags: query.getAll("tags[]"),
    clipIds: query.getAll("clipIds[]"),
    dateStart: query.get("dateStart"),
    dateEnd: query.get("dateEnd"),

    // * offense filters
    playerScoringId: query.get("playerScoringId"),
    playerAssistingId: query.get("playerAssistingId"),
    playersDefendingIds: query.getAll("playersDefendingIds[]"),

    // * defense filters
    playerDefendingId: query.get("playerDefendingId"),
    playerStoppedId: query.get("playerStoppedId"),
  };

  if (filters.clipIds && filters.clipIds.length > 0) {
    clips = clips.filter((clip) => filters.clipIds.includes(clip.clipId));
  }

  // filter clips that have at least one of the filtered tags
  if (filters.tags && filters.tags.length > 0) {
    clips = clips.filter((clip) =>
      clip.tags.some((tag) => filters.tags.includes(tag))
    );
  }

  // filter by dates
  const start = filters.dateStart;
  const end = filters.dateEnd;

  if (start) {
    clips = clips.filter((clip) => new Date(start) <= new Date(clip.date));
  }
  if (end) {
    clips = clips.filter((clip) => new Date(clip.date) <= new Date(end));
  }

  // filter offensive clips
  if (filters.play === "offense") {
    clips = clips.filter((clip) => !!clip.offense);

    if (filters.playerScoringId) {
      clips = clips.filter(
        (clip) =>
          clip.offense!.playerScoring.playerId === filters.playerScoringId
      );
    }
    if (filters.playerAssistingId) {
      clips = clips.filter((clip) => {
        const assister = clip.offense!.playerAssisting;
        if (assister) return assister.playerId === filters.playerAssistingId;
        return false;
      });
    }
    if (filters.playersDefendingIds && filters.playersDefendingIds.length > 0) {
      clips = clips.filter((clip) => {
        const defenders = clip.offense!.playersDefending;
        if (defenders && defenders.length > 0) {
          return defenders.some((def) =>
            filters.playersDefendingIds.includes(def.playerId)
          );
        }
        return false;
      });
    }
  }

  // filter defensive clips
  else if (filters.play === "defense") {
    clips = clips.filter((clip) => !!clip.defense);

    if (filters.playerDefendingId) {
      clips = clips.filter(
        (clip) =>
          clip.defense!.playerDefending.playerId === filters.playerDefendingId
      );
    }
    if (filters.playerStoppedId) {
      clips = clips.filter(
        (clip) =>
          clip.defense!.playerStopped.playerId === filters.playerStoppedId
      );
    }
  }

  return clips;
};

export const filterGames = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Record<string, any>[] | undefined,
  title: string | null,
  startDate: string | null,
  endDate: string | null,
  playerIds: string[] | null
) => {
  if (items) {
    let filtered = items as Game[];

    if (title && title !== "undefined") {
      filtered = filtered.filter((g) => g.title.startsWith(title));
    }
    if (startDate && startDate !== "undefined") {
      filtered = filtered.filter(
        (g) => new Date(g.date) >= new Date(startDate)
      );
    }
    if (endDate && endDate !== "undefined") {
      filtered = filtered.filter((g) => new Date(g.date) <= new Date(endDate));
    }
    if (playerIds && playerIds.length > 0 && playerIds[0] !== "") {
      filtered = filtered.filter((g) =>
        g.away
          .concat(g.home)
          .some((player) => playerIds.includes(player.playerId))
      );
    }

    return filtered;
  }
  return [];
};

export const filterReels = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Record<string, any>[] | undefined,
  title: string | null
) => {
  if (items) {
    let filtered = items as Reel[];

    if (title && title !== "undefined") {
      filtered = filtered.filter((g) => g.title.startsWith(title));
    }

    return filtered;
  }
  return [];
};

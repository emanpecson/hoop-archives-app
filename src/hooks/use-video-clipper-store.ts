import { ClipDetails } from "@/types/clip-details";
import { GameDraft } from "@/types/model/game-draft";
import { createRef, RefObject } from "react";
import { create } from "zustand";

type VideoClipperStore = {
	draft: GameDraft | null;
	setDraft: (draft: GameDraft) => void;
	fetchDraft: (key: string) => Promise<void>;

	source?: string;
	fetchSource: (key: string) => Promise<void>;

	videoRef: RefObject<HTMLVideoElement | null>;

	currentTime: number;
	setCurrentTime: (currentTime: number) => void;

	duration: number;
	setDuration: (duration: number) => void;

	currClipIndex: number | null;
	setCurrClipIndex: (index: number | null) => void;

	sortClips: (clips: ClipDetails[]) => ClipDetails[];

	homeScore: number;
	setHomeScore: (score: number) => void;

	awayScore: number;
	setAwayScore: (score: number) => void;

	previewClips: (i: number) => void;
};

const useVideoClipperStore = create<VideoClipperStore>((set, get) => {
	const sortClips = (clips: ClipDetails[]) => {
		// shallow copy w/ slice (to avoid mutating og array)
		return clips.slice().sort((a, b) => a.startTime - b.endTime);
	};

	const fetchDraft = async (key: string) => {
		const res = await fetch(`/api/ddb/game-drafts?title=${key}`);
		const data = (await res.json()) as GameDraft;

		const sortedClips = sortClips(data.clipsDetails);
		console.log("draft:", data);
		set({ draft: { ...data, clipsDetails: sortedClips } });
	};

	const fetchSource = async (key: string) => {
		const res = await fetch(
			`/api/s3/presigned-url?key=${key}&bucketMethod=GET`
		);
		const { presignedUrl } = await res.json();
		console.log("source:", presignedUrl);
		set({ source: presignedUrl });
	};

	const previewClips = (i: number) => {
		const vid = get().videoRef.current;
		if (!vid) return;

		set({ currClipIndex: i });

		const clip = get().draft!.clipsDetails[i];
		vid.currentTime = clip.startTime;
		vid.play();
	};

	return {
		draft: null,
		setDraft: (draft: GameDraft) => set({ draft }),
		fetchDraft,

		source: undefined,
		fetchSource,

		videoRef: createRef<HTMLVideoElement>(),

		currentTime: 0,
		setCurrentTime: (currentTime: number) => set({ currentTime }),

		duration: 0,
		setDuration: (duration: number) => set({ duration }),

		currClipIndex: null,
		setCurrClipIndex: (currClipIndex: number | null) => set({ currClipIndex }),

		sortClips,

		homeScore: 0,
		setHomeScore: (homeScore: number) => set({ homeScore }),

		awayScore: 0,
		setAwayScore: (awayScore: number) => set({ awayScore }),

		previewClips,
	};
});

export { useVideoClipperStore };

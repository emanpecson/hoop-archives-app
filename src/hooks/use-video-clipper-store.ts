import { ClipDetails } from "@/types/clip-details";
import { GameDraft } from "@/types/model/game-draft";
import { createRef, RefObject } from "react";
import { create } from "zustand";

type VideoClipperStore = {
	draft: GameDraft | null;
	setDraft: (draft: GameDraft) => void;
	fetchDraft: (key: string) => Promise<void>;

	source?: string;
	setSource: (source: string) => void;
	fetchSource: (key: string) => Promise<void>;

	videoRef: RefObject<HTMLVideoElement | null>;

	currentTime: number;
	setCurrentTime: (currentTime: number) => void;

	duration: number;
	setDuration: (duration: number) => void;

	isPreviewingClips: boolean;
	setIsPreviewingClips: (isPreviewing: boolean) => void;

	currClipIndex: number | null;
	setCurrClipIndex: (index: number | null) => void;

	clips: ClipDetails[];
	setClips: (clips: ClipDetails[]) => void;
	sortClips: (clips: ClipDetails[]) => ClipDetails[];
	handleSliderChange: (value: number[]) => void;

	homeScore: number;
	setHomeScore: (score: number) => void;

	awayScore: number;
	setAwayScore: (score: number) => void;
};

const useVideoClipperStore = create<VideoClipperStore>((set, get) => {
	const sortClips = (clips: ClipDetails[]) => {
		// shallow copy w/ slice (to avoid mutating og array)
		return clips.slice().sort((a, b) => a.startTime - b.endTime);
	};

	const handleSliderChange = (value: number[]) => {
		set({ currentTime: value[0] });
		const videoRef = get().videoRef;
		if (videoRef.current) {
			videoRef.current.currentTime = value[0];
		}
	};

	const fetchDraft = async (key: string) => {
		const res = await fetch(`/api/ddb/game-drafts?title=${key}`);
		const data = (await res.json()) as GameDraft;

		const sortedClips = sortClips(data.clipsDetails);
		console.log("draft:", data);
		set({ draft: { ...data, clipsDetails: sortedClips } });
		set({ clips: sortedClips });
	};

	const fetchSource = async (key: string) => {
		const res = await fetch(
			`/api/s3/presigned-url?key=${key}&bucketMethod=GET`
		);
		const { presignedUrl } = await res.json();
		console.log("source:", presignedUrl);
		set({ source: presignedUrl });
	};

	return {
		draft: null,
		setDraft: (draft: GameDraft) => set({ draft }),
		fetchDraft,

		source: undefined,
		setSource: (source: string) => set({ source }),
		fetchSource,

		videoRef: createRef<HTMLVideoElement>(),

		currentTime: 0,
		setCurrentTime: (currentTime: number) => set({ currentTime }),

		duration: 0,
		setDuration: (duration: number) => set({ duration }),

		isPreviewingClips: false,
		setIsPreviewingClips: (isPreviewingClips: boolean) =>
			set({ isPreviewingClips }),

		currClipIndex: null,
		setCurrClipIndex: (currClipIndex: number | null) => set({ currClipIndex }),

		clips: [],
		setClips: (clips: ClipDetails[]) => set({ clips }),
		sortClips,
		handleSliderChange,

		homeScore: 0,
		setHomeScore: (homeScore: number) => set({ homeScore }),

		awayScore: 0,
		setAwayScore: (awayScore: number) => set({ awayScore }),
	};
});

export { useVideoClipperStore };

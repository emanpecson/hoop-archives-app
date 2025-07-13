import { tempLeagueId } from "@/data/temp";
import { ClipDraft } from "@/types/clip-draft";
import { Draft } from "@/types/model/draft";
import { createRef, RefObject } from "react";
import { create } from "zustand";

type VideoClipperStore = {
	draft: Draft | null;
	setDraft: (draft: Draft) => void;
	fetchDraft: (key: string) => Promise<void>;
	unsortedClips: ClipDraft[];

	source?: string;
	fetchSource: (key: string) => Promise<void>;

	videoRef: RefObject<HTMLVideoElement | null>;

	currentTime: number;
	setCurrentTime: (currentTime: number) => void;

	duration: number;
	setDuration: (duration: number) => void;

	clipIndex: number | null;
	setClipIndex: (index: number | null) => void;

	sortClips: (clips: ClipDraft[]) => ClipDraft[];

	previewClips: (i: number) => void;
};

const useVideoClipperStore = create<VideoClipperStore>((set, get) => {
	const sortClips = (clips: ClipDraft[]) => {
		// shallow copy w/ slice (to avoid mutating og array)
		return clips.slice().sort((a, b) => a.startTime - b.endTime);
	};

	const fetchDraft = async (key: string) => {
		const res = await fetch(`/api/ddb/${tempLeagueId}/drafts/${key}`);
		const data = (await res.json()) as Draft;

		set({ unsortedClips: data.clipDrafts });
		const sortedClips = sortClips(data.clipDrafts);
		console.log("draft:", data);
		set({ draft: { ...data, clipDrafts: sortedClips } });
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

		set({ clipIndex: i });

		const clip = get().draft!.clipDrafts[i];
		vid.currentTime = clip.startTime;
		vid.play();
	};

	return {
		draft: null,
		setDraft: (draft: Draft) => set({ draft }),
		fetchDraft,
		unsortedClips: [],

		source: undefined,
		fetchSource,

		videoRef: createRef<HTMLVideoElement>(),

		currentTime: 0,
		setCurrentTime: (currentTime: number) => set({ currentTime }),

		duration: 0,
		setDuration: (duration: number) => set({ duration }),

		clipIndex: null,
		setClipIndex: (clipIndex: number | null) => set({ clipIndex }),

		sortClips,
		previewClips,
	};
});

export { useVideoClipperStore };

"use client";

import DebouncedInput from "@/components/input/debounced-input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import ReelsGallery from "./reels-gallery";

interface ReelsDashboardProps {
	leagueId: string;
}

export default function ReelsDashboard(props: ReelsDashboardProps) {
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [tempSearch, setTempSearch] = useState("");

	return (
		<div className="space-y-4 w-full mx-auto max-w-[100rem]">
			<div className="flex space-x-2 place-items-center">
				<DebouncedInput
					Icon={SearchIcon}
					onDebounce={setTitle}
					onChange={setTempSearch}
					value={tempSearch}
					placeholder="Search game title..."
				/>
			</div>
			<ReelsGallery leagueId={props.leagueId} title={title} />
		</div>
	);
}

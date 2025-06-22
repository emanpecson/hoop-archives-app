import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { cn } from "@/lib/utils";
import {
	ClipDraftFormFields,
	OffensivePlayFormFields,
	DefensivePlayFormFields,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import { SwordIcon, ShieldIcon } from "lucide-react";
import {
	Control,
	UseFormWatch,
	UseFormSetValue,
	FieldErrors,
	UseFormUnregister,
} from "react-hook-form";
import DefenseDetails from "./new-clip/sections/clip-draft/defense-details";
import OffenseDetails from "./new-clip/sections/clip-draft/offense-details";
import { Player } from "@/types/model/player";
import { Button } from "./ui/button";

interface ClipDetailsProps {
	control: Control<ClipDraftFormFields>;
	watch: UseFormWatch<ClipDraftFormFields>;
	setValue: UseFormSetValue<ClipDraftFormFields>;
	errors: FieldErrors<ClipDraftFormFields>;
	unregister: UseFormUnregister<ClipDraftFormFields>;
}

export default function ClipDetails(props: ClipDetailsProps) {
	const { control, watch, setValue, errors, unregister } = props;
	const draft = useVideoClipperStore((state) => state.draft!);
	const selectedPlay = watch("play");
	const playTypes = { offense: SwordIcon, defense: ShieldIcon };

	const setTeamBeneficiary = (player: Player) => {
		setValue("teamBeneficiary", draft.home.includes(player) ? "home" : "away");
	};

	return (
		<div className="flex divide-x divide-neutral-700">
			<div className="space-y-4 flex flex-col pr-2">
				{Object.keys(playTypes).map((play) => {
					const Icon = playTypes[play as keyof typeof playTypes];
					return (
						<Button
							key={play}
							type="button"
							className={cn(
								selectedPlay === play ? "text-white" : "text-input-muted"
							)}
							onClick={() => setValue("play", play as keyof typeof playTypes)}
						>
							<Icon />
							<span className="capitalize">{play}</span>
						</Button>
					);
				})}
			</div>
			<div className="pl-6 w-full">
				{selectedPlay === "offense" ? (
					<OffenseDetails
						playerOptions={[...draft.home, ...draft.away]}
						control={control as Control<OffensivePlayFormFields>}
						errors={errors as Partial<FieldErrors<OffensivePlayFormFields>>}
						onPrimaryPlayer={setTeamBeneficiary}
						watch={watch}
						unregister={unregister}
					/>
				) : (
					<DefenseDetails
						playerOptions={[...draft.home, ...draft.away]}
						control={control as Control<DefensivePlayFormFields>}
						errors={errors as Partial<FieldErrors<DefensivePlayFormFields>>}
						onPrimaryPlayer={setTeamBeneficiary}
						watch={watch}
						setValue={setValue}
						unregister={unregister}
					/>
				)}
			</div>
		</div>
	);
}

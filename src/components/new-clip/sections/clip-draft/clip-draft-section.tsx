import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewClipFormSectionProps } from "@/types/form-section";
import { ShieldIcon, SwordIcon } from "lucide-react";
import OffenseDetails from "./offense-details";
import DefenseDetails from "./defense-details";
import { Control, FieldErrors } from "react-hook-form";
import {
	DefensivePlayFormFields,
	OffensivePlayFormFields,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import { Player } from "@/types/model/player";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

export default function ClipDraftSection(props: NewClipFormSectionProps) {
	const { control, handleSubmit, setValue, watch, errors } = props;

	const draft = useVideoClipperStore((state) => state.draft!);
	const selectedPlay = watch("play");
	const playTypes = { offense: SwordIcon, defense: ShieldIcon };

	const setTeamBeneficiary = (player: Player) => {
		setValue("teamBeneficiary", draft.home.includes(player) ? "home" : "away");
	};

	return (
		<FormSection {...props} handleSubmit={handleSubmit}>
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
						/>
					) : (
						<DefenseDetails
							playerOptions={[...draft.home, ...draft.away]}
							control={control as Control<DefensivePlayFormFields>}
							errors={errors as Partial<FieldErrors<DefensivePlayFormFields>>}
							onPrimaryPlayer={setTeamBeneficiary}
						/>
					)}
				</div>
			</div>
		</FormSection>
	);
}

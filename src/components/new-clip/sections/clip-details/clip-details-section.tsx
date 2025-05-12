import FormSection from "@/components/form-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewClipFormSectionProps } from "@/types/form-section";
import { ShieldIcon, SwordIcon } from "lucide-react";
import OffenseDetails from "./offense-details";
import DefenseDetails from "./defense-details";
import { Control, FieldErrors, useForm } from "react-hook-form";
import {
	ClipDetailsFormFields,
	clipDetailsSchema,
	DefensivePlayFormFields,
	OffensivePlayFormFields,
} from "@/types/schema/new-clip-form/clip-details-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PointsAdded } from "@/types/enum/points-added";
import { Player } from "@/types/model/player";

export default function ClipDetailsSection(props: NewClipFormSectionProps) {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ClipDetailsFormFields>({
		resolver: zodResolver(clipDetailsSchema),
		defaultValues: { play: "offense", pointsAdded: PointsAdded.TWO_POINTER },
	});

	const selectedPlay = watch("play");
	const playTypes = { offense: SwordIcon, defense: ShieldIcon };

	const defineTeamBeneficiary = (player: Player) => {
		if (props.draft.home.includes(player)) {
			setValue("teamBeneficiary", "Home");
		} else {
			setValue("teamBeneficiary", "Away");
		}
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
							playerOptions={[...props.draft.home, ...props.draft.away]}
							draft={props.draft}
							control={control as Control<OffensivePlayFormFields>}
							errors={errors as Partial<FieldErrors<OffensivePlayFormFields>>}
							onPrimaryPlayer={defineTeamBeneficiary}
						/>
					) : (
						<DefenseDetails
							playerOptions={[...props.draft.home, ...props.draft.away]}
							control={control as Control<DefensivePlayFormFields>}
							errors={errors as Partial<FieldErrors<DefensivePlayFormFields>>}
							onPrimaryPlayer={defineTeamBeneficiary}
						/>
					)}
				</div>
			</div>
		</FormSection>
	);
}

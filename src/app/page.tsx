"use client";

import FeatureSection from "@/components/landing/feature-section";
import HeaderSection from "@/components/landing/header-section";
import HeroSection from "@/components/landing/hero-section";
import { tempLeagueId } from "@/data/temp";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const demoLeaguePath = `/league/${tempLeagueId}`;

  const [selectedAppFeature, setSelectedAppFeature] = useState(0);

  return (
    <div className="w-full h-full flex flex-col place-items-center justify-center">
      <div className="w-full h-full max-w-[76rem] sm:px-24 px-8">
        <HeaderSection session={session} demoLeaguePath={demoLeaguePath} />

        <div className="sm:pt-32 pt-10 sm:space-y-16 space-y-8">
          <HeroSection
            session={session}
            sessionStatus={status}
            demoLeaguePath={demoLeaguePath}
          />

          <FeatureSection
            selectedAppFeature={selectedAppFeature}
            setSelectedAppFeature={setSelectedAppFeature}
            demoLeaguePath={demoLeaguePath}
          />
        </div>
      </div>
    </div>
  );
}

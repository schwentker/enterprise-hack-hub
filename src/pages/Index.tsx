import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { AboutSection } from "@/components/AboutSection";
import { ChallengeTracksSection } from "@/components/ChallengeTracksSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { PrizesSection } from "@/components/PrizesSection";
import { PastInnovationsSection } from "@/components/PastInnovationsSection";
import { FAQSection } from "@/components/FAQSection";
import { RegistrationSection } from "@/components/RegistrationSection";
import { Footer } from "@/components/Footer";
import { FloatingRegisterButton, ScrollToTopButton } from "@/components/FloatingButtons";
import { useScrollAnimation, useParallax } from "@/hooks/useAnimations";

const Index = () => {
  useScrollAnimation();
  useParallax();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <StatsBar />
        <div className="fade-in-scroll">
          <AboutSection />
        </div>
        <div className="fade-in-scroll">
          <ChallengeTracksSection />
        </div>
        <div className="fade-in-scroll">
          <ScheduleSection />
        </div>
        <div className="fade-in-scroll">
          <PrizesSection />
        </div>
        <div className="fade-in-scroll">
          <PastInnovationsSection />
        </div>
        <div className="fade-in-scroll">
          <FAQSection />
        </div>
        <div className="fade-in-scroll">
          <RegistrationSection />
        </div>
      </main>
      <Footer />
      <FloatingRegisterButton />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;

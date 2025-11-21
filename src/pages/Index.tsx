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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ChallengeTracksSection />
      <ScheduleSection />
      <PrizesSection />
      <PastInnovationsSection />
      <FAQSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
};

export default Index;

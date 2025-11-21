import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { AboutSection } from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      
      {/* Placeholder sections for future prompts */}
      
      <section id="challenges" className="min-h-screen flex items-center justify-center bg-card">
        <div className="text-center text-muted-foreground">
          <h2 className="text-3xl font-bold mb-4">Challenges Section</h2>
          <p>Coming soon...</p>
        </div>
      </section>
      
      <section id="schedule" className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h2 className="text-3xl font-bold mb-4">Schedule Section</h2>
          <p>Coming soon...</p>
        </div>
      </section>
      
      <section id="prizes" className="min-h-screen flex items-center justify-center bg-card">
        <div className="text-center text-muted-foreground">
          <h2 className="text-3xl font-bold mb-4">Prizes Section</h2>
          <p>Coming soon...</p>
        </div>
      </section>
      
      <section id="register" className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h2 className="text-3xl font-bold mb-4">Register Section</h2>
          <p>Coming soon...</p>
        </div>
      </section>
    </div>
  );
};

export default Index;

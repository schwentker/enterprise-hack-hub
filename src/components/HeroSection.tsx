import { Button } from "@/components/ui/button";
import { DynamicCountdown } from "@/components/DynamicCountdown";
import { LiveRegistrationCounter } from "@/components/LiveRegistrationCounter";
import { TeamMatchingModal } from "@/components/TeamMatchingModal";
import { ArrowRight, Calendar } from "lucide-react";

export const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-primary opacity-30 animate-glow-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Headline */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build What Matters.
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Ship What Works.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              A 48-hour enterprise hackathon where non-technical builders become product creators
            </p>
          </div>

          {/* Live Stats & Countdown */}
          <div className="animate-scale-in space-y-6" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>March 1-3, 2025 • Remote + In-Person</span>
            </div>
            <LiveRegistrationCounter maxSpots={150} />
            <DynamicCountdown />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              size="lg"
              onClick={() => scrollToSection("#register")}
              className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-6 text-lg shadow-glow transition-all hover:scale-105 group"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <TeamMatchingModal />
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#challenges")}
              className="border-primary/50 hover:bg-primary/10 font-semibold px-8 py-6 text-lg"
            >
              View Challenges
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

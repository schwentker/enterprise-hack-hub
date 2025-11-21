import { Sparkles, Box, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const tracks = [
  {
    icon: Sparkles,
    title: "Promptathon",
    subtitle: "For Non-Technical Builders",
    description: "Describe what you want. Watch it materialize. No code required - just clear thinking and creative vision.",
    tag: "Beginner Friendly",
    accentColor: "primary",
    gradientFrom: "from-primary/20",
    borderColor: "border-primary/30",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tagVariant: "default" as const,
  },
  {
    icon: Box,
    title: "Buildathon",
    subtitle: "For Product Managers & Designers",
    description: "Prototype real products with optional technical teammates. Focus on market fit, user experience, and shipping something people want.",
    tag: "Most Popular",
    accentColor: "secondary",
    gradientFrom: "from-secondary/20",
    borderColor: "border-secondary/30",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    tagVariant: "secondary" as const,
  },
  {
    icon: Zap,
    title: "Vibeathon",
    subtitle: "For Multidisciplinary Teams",
    description: "Hackers, designers, and domain experts collaborate on complex problems. Build fast, integrate deeply, ship completely.",
    tag: "Advanced",
    accentColor: "accent",
    gradientFrom: "from-accent/20",
    borderColor: "border-accent/30",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    tagVariant: "outline" as const,
  },
];

export const AboutSection = () => {
  const scrollToRegister = (track: string) => {
    const element = document.querySelector("#register");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Store selected track in sessionStorage for the registration form
      sessionStorage.setItem("selectedTrack", track);
    }
  };

  return (
    <section id="about" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Three Ways to Build
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're a prompt engineer, product manager, or full-stack developer - there's a track for you
          </p>
        </div>

        {/* Track Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {tracks.map((track, index) => {
            const Icon = track.icon;
            return (
              <Card
                key={track.title}
                className={`relative p-6 md:p-8 bg-card border-2 ${track.borderColor} hover:border-${track.accentColor} transition-all duration-300 hover:shadow-glow hover:-translate-y-2 group animate-fade-in overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${track.gradientFrom} to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity`} />

                {/* Content */}
                <div className="relative space-y-4">
                  {/* Icon & Tag */}
                  <div className="flex items-start justify-between">
                    <div className={`${track.iconBg} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${track.iconColor}`} />
                    </div>
                    <Badge variant={track.tagVariant} className="text-xs">
                      {track.tag}
                    </Badge>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/80 leading-relaxed">
                    {track.description}
                  </p>

                  {/* CTA Button */}
                  <Button
                    variant="ghost"
                    onClick={() => scrollToRegister(track.title)}
                    className={`w-full mt-4 ${track.iconColor} hover:bg-${track.accentColor}/10 group/btn`}
                  >
                    Choose {track.title}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect, useRef } from "react";
import { Users, Clock, Trophy, Target } from "lucide-react";

const stats = [
  { icon: Users, value: 150, suffix: "+", label: "Builders" },
  { icon: Clock, value: 48, suffix: "", label: "Hours" },
  { icon: Trophy, value: 50, suffix: "K", label: "in Prizes" },
  { icon: Target, value: 6, suffix: "", label: "Challenge Tracks" },
];

export const StatsBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const durations = stats.map(() => 2000); // 2 seconds
    const steps = 60;
    const intervals = stats.map((stat, index) => {
      const increment = stat.value / steps;
      let currentStep = 0;

      return setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = Math.min(
              Math.round(increment * currentStep),
              stat.value
            );
            return newCounts;
          });
        }
      }, durations[index] / steps);
    });

    return () => intervals.forEach(clearInterval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 bg-card border-y border-border"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-8 h-8 mx-auto text-primary mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {isVisible ? (
                    <>
                      {stat.value === 50 ? "$" : ""}
                      {counts[index]}
                      {stat.suffix}
                    </>
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

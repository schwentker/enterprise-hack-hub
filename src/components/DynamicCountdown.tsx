import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define event phases
const phases = {
  registration_open: {
    label: "Registration Open",
    end: new Date("2026-01-31T23:59:59"),
    nextPhase: "registration_closing",
  },
  registration_closing: {
    label: "Registration Closes In",
    end: new Date("2026-02-13T23:59:59"),
    nextPhase: "hackathon_starting",
  },
  hackathon_starting: {
    label: "Hackathon Starts In",
    end: new Date("2026-02-14T09:00:00"),
    nextPhase: "hackathon_in_progress",
  },
  hackathon_in_progress: {
    label: "Hackathon In Progress",
    end: new Date("2026-02-15T18:00:00"),
    nextPhase: "judging",
  },
  judging: {
    label: "Judging Phase",
    end: new Date("2026-02-22T23:59:59"),
    nextPhase: "complete",
  },
  complete: {
    label: "Event Complete",
    end: null,
    nextPhase: null,
  },
};

type PhaseKey = keyof typeof phases;

export const DynamicCountdown = () => {
  const [currentPhase, setCurrentPhase] = useState<PhaseKey>("registration_open");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      
      // Determine current phase
      let activePhase: PhaseKey = "registration_open";
      for (const [key, phase] of Object.entries(phases)) {
        if (phase.end && now < phase.end) {
          activePhase = key as PhaseKey;
          break;
        }
        if (phase.nextPhase) {
          activePhase = phase.nextPhase as PhaseKey;
        }
      }
      
      setCurrentPhase(activePhase);
      
      // Calculate time until phase end
      const phaseEnd = phases[activePhase].end;
      if (phaseEnd) {
        const days = differenceInDays(phaseEnd, now);
        const hours = differenceInHours(phaseEnd, now) % 24;
        const minutes = differenceInMinutes(phaseEnd, now) % 60;
        const seconds = differenceInSeconds(phaseEnd, now) % 60;
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "registration_open":
      case "registration_closing":
        return "bg-primary/10 text-primary border-primary/20";
      case "hackathon_starting":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "hackathon_in_progress":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "judging":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-card border border-primary/20 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px] shadow-glow">
        <div className="text-2xl md:text-4xl font-bold text-primary tabular-nums">
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  if (currentPhase === "complete") {
    return (
      <div className="text-center space-y-4">
        <Badge className={`text-lg px-4 py-2 ${getPhaseColor()}`}>
          {phases[currentPhase].label}
        </Badge>
        <p className="text-muted-foreground">Thank you for participating!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Badge className={`text-lg px-4 py-2 ${getPhaseColor()}`}>
        {phases[currentPhase].label}
      </Badge>
      
      {phases[currentPhase].end && (
        <div className="flex gap-2 md:gap-4 justify-center">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      )}
    </div>
  );
};

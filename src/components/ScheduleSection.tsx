import { useState } from "react";
import { Clock, Users, Target, Hammer, FileText, Trophy, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Timezone = {
  value: string;
  label: string;
  offset: number; // hours from PST
};

const timezones: Timezone[] = [
  { value: "PST", label: "PST (Pacific)", offset: 0 },
  { value: "MST", label: "MST (Mountain)", offset: 1 },
  { value: "CST", label: "CST (Central)", offset: 2 },
  { value: "EST", label: "EST (Eastern)", offset: 3 },
  { value: "GMT", label: "GMT (London)", offset: 8 },
  { value: "CET", label: "CET (Paris)", offset: 9 },
  { value: "JST", label: "JST (Tokyo)", offset: 17 },
];

type Activity = {
  title: string;
  duration: number;
  icon: typeof Clock;
  isCheckpoint?: boolean;
};

type Phase = {
  name: string;
  subtitle: string;
  startHour: number;
  endHour: number;
  color: string;
  bgColor: string;
  borderColor: string;
  activities: Activity[];
};

const phases: Phase[] = [
  {
    name: "Ideation",
    subtitle: "Define the Problem",
    startHour: 0,
    endHour: 8,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    activities: [
      { title: "Kickoff & Challenge Deep Dive", duration: 2, icon: Target },
      { title: "Team Formation & Matching", duration: 1, icon: Users },
      { title: "Problem Scoping Workshop", duration: 2, icon: Target },
      { title: "Solo/Team Working Time", duration: 3, icon: Hammer },
      { title: "CHECKPOINT: Problem Statement Due", duration: 0, icon: Zap, isCheckpoint: true },
    ],
  },
  {
    name: "Build",
    subtitle: "Create the Solution",
    startHour: 8,
    endHour: 40,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30",
    activities: [
      { title: "Building Sprint 1", duration: 8, icon: Hammer },
      { title: "Mentor Office Hours", duration: 2, icon: Users },
      { title: "Building Sprint 2", duration: 8, icon: Hammer },
      { title: "CHECKPOINT: Working Prototype Due", duration: 0, icon: Zap, isCheckpoint: true },
      { title: "Building Sprint 3", duration: 6, icon: Hammer },
      { title: "Polish & Documentation", duration: 8, icon: FileText },
    ],
  },
  {
    name: "Ship",
    subtitle: "Deliver & Present",
    startHour: 40,
    endHour: 48,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    activities: [
      { title: "Final Submissions", duration: 2, icon: FileText },
      { title: "Judging Period", duration: 4, icon: Target },
      { title: "Demo Day & Awards", duration: 2, icon: Trophy },
    ],
  },
];

const formatTime = (hour: number, timezone: Timezone, startDate: Date = new Date(2026, 0, 15, 9, 0, 0)) => {
  const eventHour = startDate.getHours() + hour + timezone.offset;
  const days = Math.floor(eventHour / 24);
  const hours = eventHour % 24;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  
  if (days > 0) {
    return `Day ${days + 1} ${displayHour}:00 ${period}`;
  }
  return `${displayHour}:00 ${period}`;
};

export const ScheduleSection = () => {
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone>(timezones[0]);
  const [currentHour] = useState(12); // Simulated current hour for demo (12 hours into event)
  const progressPercentage = (currentHour / 48) * 100;

  return (
    <section id="schedule" className="py-24 px-4 bg-background-secondary">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            48 Hours. Three Phases. One Goal: Ship.
          </h2>
          
          {/* Timezone Selector */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <Select
              value={selectedTimezone.value}
              onValueChange={(value) => {
                const tz = timezones.find((t) => t.value === value);
                if (tz) setSelectedTimezone(tz);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Event Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          {/* You Are Here marker */}
          <div
            className="absolute left-8 w-4 h-4 -ml-[7px] bg-primary rounded-full animate-pulse shadow-glow z-10"
            style={{ top: `${(currentHour / 48) * 100}%` }}
          >
            <div className="absolute left-6 top-0 whitespace-nowrap">
              <Badge className="bg-primary text-primary-foreground">
                You Are Here
              </Badge>
            </div>
          </div>

          {/* Phases */}
          {phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="mb-16 last:mb-0">
              {/* Phase Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 border-border relative z-10">
                  <span className={`text-2xl font-bold ${phase.color}`}>
                    {phaseIndex + 1}
                  </span>
                </div>
                <div className="flex-1 pt-3">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className={`text-3xl font-bold ${phase.color}`}>
                      {phase.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      Hours {phase.startHour}-{phase.endHour}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2">{phase.subtitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(phase.startHour, selectedTimezone)} -{" "}
                    {formatTime(phase.endHour, selectedTimezone)}
                  </p>
                </div>
              </div>

              {/* Activities */}
              <div className="ml-16 space-y-4">
                {phase.activities.map((activity, activityIndex) => {
                  const ActivityIcon = activity.icon;
                  
                  if (activity.isCheckpoint) {
                    return (
                      <div
                        key={activityIndex}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 ${phase.borderColor} ${phase.bgColor}`}
                      >
                        <ActivityIcon className={`w-5 h-5 ${phase.color}`} />
                        <span className={`font-semibold ${phase.color}`}>
                          {activity.title}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={activityIndex}
                      className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                    >
                      <ActivityIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.duration} {activity.duration === 1 ? "hour" : "hours"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

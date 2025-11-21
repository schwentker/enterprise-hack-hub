import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  targetDate: Date;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      const seconds = differenceInSeconds(targetDate, now) % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-card border border-primary/20 rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px] shadow-glow">
        <div className="text-3xl md:text-5xl font-bold text-primary tabular-nums">
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

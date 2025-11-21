import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LiveRegistrationCounterProps {
  maxSpots?: number;
}

export const LiveRegistrationCounter = ({ maxSpots = 150 }: LiveRegistrationCounterProps) => {
  const [count, setCount] = useState<number>(66);
  const [isLoading, setIsLoading] = useState(false);

  const percentage = (count / maxSpots) * 100;
  const getColor = () => {
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 70) return "text-yellow-500";
    return "text-primary";
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`text-2xl md:text-3xl font-bold tabular-nums transition-colors duration-300 ${getColor()}`}>
        {count}/{maxSpots}
      </span>
      <span className="text-muted-foreground">spots claimed</span>
    </div>
  );
};

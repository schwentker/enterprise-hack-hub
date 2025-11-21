import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LiveRegistrationCounterProps {
  maxSpots?: number;
}

export const LiveRegistrationCounter = ({ maxSpots = 150 }: LiveRegistrationCounterProps) => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial count
    const fetchCount = async () => {
      const { count: initialCount, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
      
      if (!error && initialCount !== null) {
        setCount(initialCount);
      }
      setIsLoading(false);
    };

    fetchCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('registration-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'registrations'
        },
        () => {
          setCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

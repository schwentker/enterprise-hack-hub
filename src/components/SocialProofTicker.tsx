import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus } from "lucide-react";

interface Activity {
  id: string;
  type: 'registration' | 'team';
  message: string;
  timestamp: Date;
}

export const SocialProofTicker = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Subscribe to new registrations
    const registrationChannel = supabase
      .channel('registration-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'registrations'
        },
        (payload: any) => {
          const newActivity: Activity = {
            id: payload.new.id,
            type: 'registration',
            message: `${payload.new.full_name.split(' ')[0]} just registered`,
            timestamp: new Date(),
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    // Subscribe to team seekers
    const teamChannel = supabase
      .channel('team-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_seekers'
        },
        (payload: any) => {
          const newActivity: Activity = {
            id: payload.new.id,
            type: 'team',
            message: `${payload.new.user_name.split(' ')[0]} is looking for teammates`,
            timestamp: new Date(),
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationChannel);
      supabase.removeChannel(teamChannel);
    };
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activities.length]);

  if (activities.length === 0) {
    return null;
  }

  const currentActivity = activities[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div className="bg-card border border-primary/20 rounded-lg p-4 shadow-glow animate-fade-in">
        <div className="flex items-center gap-3">
          {currentActivity.type === 'registration' ? (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{currentActivity.message}</p>
            <p className="text-xs text-muted-foreground">Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

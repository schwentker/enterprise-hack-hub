import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useRealtimeNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  useEffect(() => {
    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Registration notifications
    const registrationsChannel = supabase
      .channel("registrations-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          const reg = payload.new as any;
          const message = `New registration: ${reg.full_name}${reg.company ? ` from ${reg.company}` : ""}`;
          
          toast({
            title: "New Registration",
            description: message,
          });

          // Browser notification
          if (Notification.permission === "granted") {
            new Notification("New Registration", { body: message });
          }

          setNotifications((prev) => [
            {
              id: reg.id,
              type: "registration",
              message,
              timestamp: new Date(),
              read: false,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    // Team formations
    const teamsChannel = supabase
      .channel("teams-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          const team = payload.new as any;
          const message = `Team formed: ${team.name}`;
          
          toast({
            title: "New Team",
            description: message,
          });

          if (Notification.permission === "granted") {
            new Notification("New Team", { body: message });
          }

          setNotifications((prev) => [
            {
              id: team.id,
              type: "team",
              message,
              timestamp: new Date(),
              read: false,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    // Submissions
    const submissionsChannel = supabase
      .channel("submissions-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          const sub = payload.new as any;
          const message = `Submission received: ${sub.project_name}`;
          
          toast({
            title: "New Submission",
            description: message,
          });

          if (Notification.permission === "granted") {
            new Notification("New Submission", { body: message });
          }

          setNotifications((prev) => [
            {
              id: sub.id,
              type: "submission",
              message,
              timestamp: new Date(),
              read: false,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    // Scores
    const scoresChannel = supabase
      .channel("scores-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scores",
        },
        (payload) => {
          const score = payload.new as any;
          const avgScore = (score.innovation_score + score.quality_score + score.impact_score + score.platform_score) / 4;
          const message = `New score submitted: ${avgScore.toFixed(1)}/10`;
          
          toast({
            title: "Judge Score",
            description: message,
          });

          setNotifications((prev) => [
            {
              id: score.id,
              type: "score",
              message,
              timestamp: new Date(),
              read: false,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(submissionsChannel);
      supabase.removeChannel(scoresChannel);
    };
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
  };
}

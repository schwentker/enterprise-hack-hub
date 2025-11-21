import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Users, FileText, Gavel } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface EventHealthMetricsProps {
  registrations: any[];
  teams: any[];
  submissions: any[];
  teamSeekers: any[];
  scores: any[];
}

export function EventHealthMetrics({
  registrations,
  teams,
  submissions,
  teamSeekers,
  scores,
}: EventHealthMetricsProps) {
  const { data: eventSettings } = useQuery({
    queryKey: ["event-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Calculate warnings
  const peopleLookingForTeams = teamSeekers.length;
  const teamsWithoutSubmissions = teams.filter((team: any) => {
    return !submissions.some((sub: any) => sub.team_id === team.id);
  }).length;

  // Get unique judges who have scored
  const judgesWhoScored = new Set(scores.map((s: any) => s.judge_id));
  
  // Calculate expected judges (assume each submission should have at least 3 judges)
  const expectedJudgeAssignments = submissions.length * 3;
  const actualJudgeAssignments = scores.length;
  const incompleteJudging = expectedJudgeAssignments - actualJudgeAssignments;

  // Current phase progress
  const phaseProgress = eventSettings?.current_phase === "Setup" ? 25 :
                       eventSettings?.current_phase === "Registration" ? 50 :
                       eventSettings?.current_phase === "Building" ? 75 : 100;

  const warnings = [
    {
      show: peopleLookingForTeams > 0,
      message: `${peopleLookingForTeams} people still looking for teams`,
      icon: Users,
      severity: "warning" as const,
    },
    {
      show: teamsWithoutSubmissions > 0,
      message: `${teamsWithoutSubmissions} teams haven't submitted yet`,
      icon: FileText,
      severity: "warning" as const,
    },
    {
      show: incompleteJudging > 0,
      message: `${incompleteJudging} scoring assignments incomplete`,
      icon: Gavel,
      severity: "info" as const,
    },
  ].filter((w) => w.show);

  return (
    <div className="space-y-4">
      {/* Current Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Event Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Phase:</span>
              <Badge>{eventSettings?.current_phase || "Setup"}</Badge>
            </div>
            <Progress value={phaseProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Setup</span>
              <span>Registration</span>
              <span>Building</span>
              <span>Complete</span>
            </div>
          </div>

          {eventSettings?.next_phase_at && (
            <div className="text-sm">
              <span className="text-muted-foreground">Next phase in: </span>
              <span className="font-medium">
                {formatDistanceToNow(parseISO(eventSettings.next_phase_at))}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="border-orange-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  warning.severity === "warning"
                    ? "bg-orange-500/10 border border-orange-500/20"
                    : "bg-blue-500/10 border border-blue-500/20"
                }`}
              >
                <warning.icon
                  className={`h-4 w-4 mt-0.5 ${
                    warning.severity === "warning" ? "text-orange-500" : "text-blue-500"
                  }`}
                />
                <p className="text-sm font-medium">{warning.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">Total Registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">Teams Formed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{judgesWhoScored.size}</div>
            <p className="text-xs text-muted-foreground">Active Judges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

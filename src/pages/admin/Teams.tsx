import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCards } from "@/components/admin/TeamCards";
import { MatchingQueue } from "@/components/admin/MatchingQueue";
import { TeamDetailModal } from "@/components/admin/TeamDetailModal";
import { Users, UserPlus, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Team {
  id: string;
  name: string;
  track: string;
  challenge: string | null;
  status: string;
  max_members: number;
  created_at: string;
  updated_at: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  registration_id: string;
  role: string | null;
  joined_at: string;
  registration?: {
    full_name: string;
    email: string;
    role: string;
  };
}

export default function Teams() {
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [view, setView] = useState<"cards" | "queue">("cards");

  const { data: teams = [], refetch: refetchTeams } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (
            id,
            team_id,
            registration_id,
            role,
            joined_at,
            registrations (
              full_name,
              email,
              role
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data.map((team) => ({
        ...team,
        members: team.team_members.map((tm: any) => ({
          id: tm.id,
          team_id: tm.team_id,
          registration_id: tm.registration_id,
          role: tm.role,
          joined_at: tm.joined_at,
          registration: tm.registrations,
        })),
      })) as Team[];
    },
  });

  const { data: seekers = [], refetch: refetchSeekers } = useQuery({
    queryKey: ["team-seekers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_seekers")
        .select("*")
        .eq("looking_for_team", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Real-time subscriptions
  useEffect(() => {
    const teamsChannel = supabase
      .channel("teams-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        () => {
          refetchTeams();
        }
      )
      .subscribe();

    const membersChannel = supabase
      .channel("team-members-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
        },
        () => {
          refetchTeams();
        }
      )
      .subscribe();

    const seekersChannel = supabase
      .channel("team-seekers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_seekers",
        },
        () => {
          refetchSeekers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(seekersChannel);
    };
  }, [refetchTeams, refetchSeekers]);

  // Calculate metrics
  const totalTeams = teams.length;
  const peopleLooking = seekers.length;
  const averageTeamSize =
    teams.length > 0
      ? teams.reduce((sum, team) => sum + (team.members?.length || 0), 0) / teams.length
      : 0;

  const trackBreakdown = teams.reduce((acc, team) => {
    acc[team.track] = (acc[team.track] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage hackathon teams and matchmaking</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams Formed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Looking for Team</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{peopleLooking}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTeamSize.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Distribution</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {Object.entries(trackBreakdown).map(([track, count]) => (
                <div key={track} className="flex justify-between">
                  <span className="text-muted-foreground">{track}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Views Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as "cards" | "queue")}>
        <TabsList>
          <TabsTrigger value="cards">Team Cards</TabsTrigger>
          <TabsTrigger value="queue">
            Matching Queue
            {peopleLooking > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {peopleLooking}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-6">
          <TeamCards teams={teams} onTeamClick={setSelectedTeam} onUpdate={refetchTeams} />
        </TabsContent>

        <TabsContent value="queue" className="mt-6">
          <MatchingQueue
            seekers={seekers}
            teams={teams}
            onUpdate={() => {
              refetchSeekers();
              refetchTeams();
            }}
          />
        </TabsContent>
      </Tabs>

      <TeamDetailModal
        team={selectedTeam}
        open={!!selectedTeam}
        onOpenChange={(open) => !open && setSelectedTeam(null)}
        onUpdate={refetchTeams}
      />
    </div>
  );
}

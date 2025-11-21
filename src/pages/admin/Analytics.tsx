import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, AlertTriangle } from "lucide-react";
import { RegistrationCharts } from "@/components/admin/analytics/RegistrationCharts";
import { EngagementCharts } from "@/components/admin/analytics/EngagementCharts";
import { EventHealthMetrics } from "@/components/admin/analytics/EventHealthMetrics";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { toast } = useToast();

  const { data: registrations = [] } = useQuery({
    queryKey: ["analytics-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["analytics-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (*)
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["analytics-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          awards (*)
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: teamSeekers = [] } = useQuery({
    queryKey: ["analytics-seekers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_seekers")
        .select("*")
        .eq("looking_for_team", true);

      if (error) throw error;
      return data;
    },
  });

  const { data: scores = [] } = useQuery({
    queryKey: ["analytics-scores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scores").select("*");

      if (error) throw error;
      return data;
    },
  });

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Company",
      "Role",
      "Track",
      "Team Status",
      "Experience Level",
      "Challenges",
      "How Heard",
      "Registered At",
    ];

    const rows = registrations.map((reg) => [
      reg.id,
      reg.full_name,
      reg.email,
      reg.company || "",
      reg.role,
      reg.track,
      reg.team_status,
      reg.experience_level,
      reg.challenges.join("; "),
      reg.how_heard,
      new Date(reg.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Analytics data has been exported to CSV",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation",
      description: "PDF report generation is coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Event insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Raw Data
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Event Health */}
      <EventHealthMetrics
        registrations={registrations}
        teams={teams}
        submissions={submissions}
        teamSeekers={teamSeekers}
        scores={scores}
      />

      {/* Registration Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationCharts
            registrations={registrations}
            teams={teams}
            submissions={submissions}
          />
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementCharts registrations={registrations} teams={teams} />
        </CardContent>
      </Card>
    </div>
  );
}

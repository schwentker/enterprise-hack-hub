import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RegistrationTable } from "@/components/admin/RegistrationTable";
import { RegistrationFilters } from "@/components/admin/RegistrationFilters";
import { RegistrationDetailModal } from "@/components/admin/RegistrationDetailModal";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  role: string;
  track: string;
  team_status: string;
  challenges: string[];
  experience_level: string;
  how_heard: string;
  agreed_to_code_of_conduct: boolean;
  registration_number: number;
  created_at: string;
}

export default function Registrations() {
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState<string[]>([]);
  const [teamStatusFilter, setTeamStatusFilter] = useState<string[]>([]);
  const [challengeFilter, setChallengeFilter] = useState<string[]>([]);

  const { data: registrations = [], refetch } = useQuery({
    queryKey: ["admin-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Registration[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("registrations-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          toast({
            title: "New Registration!",
            description: `${(payload.new as Registration).full_name} just registered`,
          });
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchQuery === "" ||
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrack =
      trackFilter.length === 0 || trackFilter.includes(reg.track);

    const matchesTeamStatus =
      teamStatusFilter.length === 0 || teamStatusFilter.includes(reg.team_status);

    const matchesChallenge =
      challengeFilter.length === 0 ||
      reg.challenges.some((c) => challengeFilter.includes(c));

    return matchesSearch && matchesTrack && matchesTeamStatus && matchesChallenge;
  });

  const exportToCSV = (data: Registration[]) => {
    const headers = [
      "Registration #",
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

    const rows = data.map((reg) => [
      reg.registration_number,
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
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSelected = () => {
    const selected = registrations.filter((reg) => selectedRows.includes(reg.id));
    exportToCSV(selected);
    toast({
      title: "Export Complete",
      description: `Exported ${selected.length} registration(s)`,
    });
  };

  const handleExportAll = () => {
    exportToCSV(filteredRegistrations);
    toast({
      title: "Export Complete",
      description: `Exported ${filteredRegistrations.length} registration(s)`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registrations</h1>
          <p className="text-muted-foreground">
            {filteredRegistrations.length} registration(s)
          </p>
        </div>
        <div className="flex gap-2">
          {selectedRows.length > 0 && (
            <>
              <Button variant="outline" onClick={handleExportSelected}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected ({selectedRows.length})
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Selected
              </Button>
            </>
          )}
          <Button onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RegistrationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            trackFilter={trackFilter}
            onTrackFilterChange={setTrackFilter}
            teamStatusFilter={teamStatusFilter}
            onTeamStatusFilterChange={setTeamStatusFilter}
            challengeFilter={challengeFilter}
            onChallengeFilterChange={setChallengeFilter}
          />
        </div>

        <div className="lg:col-span-3">
          <RegistrationTable
            registrations={filteredRegistrations}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            onRowClick={setSelectedRegistration}
          />
        </div>
      </div>

      <RegistrationDetailModal
        registration={selectedRegistration}
        open={!!selectedRegistration}
        onOpenChange={(open) => !open && setSelectedRegistration(null)}
        onUpdate={refetch}
      />
    </div>
  );
}

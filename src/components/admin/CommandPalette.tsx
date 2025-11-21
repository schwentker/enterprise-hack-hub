import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  UserPlus,
  FileText,
  Trophy,
  BarChart,
  Settings,
  Download,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: registrations = [] } = useQuery({
    queryKey: ["search-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("id, full_name, email, company")
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["search-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name")
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["search-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id, project_name")
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Export functionality would be triggered here
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search registrations, teams, submissions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => { navigate("/admin"); setOpen(false); }}>
            <BarChart className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/registrations"); setOpen(false); }}>
            <Users className="mr-2 h-4 w-4" />
            <span>Registrations</span>
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/teams"); setOpen(false); }}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Teams</span>
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/submissions"); setOpen(false); }}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Submissions</span>
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/analytics"); setOpen(false); }}>
            <Trophy className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/settings"); setOpen(false); }}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        {registrations.length > 0 && (
          <CommandGroup heading="Registrations">
            {registrations.map((reg) => (
              <CommandItem
                key={reg.id}
                onSelect={() => {
                  navigate("/admin/registrations");
                  setOpen(false);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>{reg.full_name}</span>
                {reg.company && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {reg.company}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {teams.length > 0 && (
          <CommandGroup heading="Teams">
            {teams.map((team) => (
              <CommandItem
                key={team.id}
                onSelect={() => {
                  navigate("/admin/teams");
                  setOpen(false);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>{team.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {submissions.length > 0 && (
          <CommandGroup heading="Submissions">
            {submissions.map((sub) => (
              <CommandItem
                key={sub.id}
                onSelect={() => {
                  navigate("/admin/submissions");
                  setOpen(false);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{sub.project_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

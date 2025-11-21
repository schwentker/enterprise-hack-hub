import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ExternalLink, HelpCircle, Search } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventSettings {
  event_name: string;
  event_status: string;
  current_phase: string;
  next_phase_at: string | null;
}

const statusColors = {
  setup: "bg-muted text-muted-foreground",
  registration_open: "bg-green-500/10 text-green-500 border-green-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  judging: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-muted text-muted-foreground",
};

export function AdminTopBar() {
  const { user, signOut } = useAdminAuth();
  const [settings, setSettings] = useState<EventSettings | null>(null);

  useEffect(() => {
    fetchSettings();
    
    const channel = supabase
      .channel('event_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_settings'
        },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('event_settings')
      .select('*')
      .single();
    
    if (data) setSettings(data);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">
            {settings?.event_name || "Lovable Enterprise Hacks"}
          </h1>
          {settings && (
            <Badge 
              variant="outline" 
              className={statusColors[settings.event_status as keyof typeof statusColors]}
            >
              {formatStatus(settings.event_status)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {settings?.current_phase && (
          <span className="text-sm text-muted-foreground hidden md:inline">
            {settings.current_phase}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          title="Search (Cmd/Ctrl+K)"
        >
          <Search className="h-5 w-5" />
        </Button>

        <NotificationCenter />

        <ThemeToggle />

        <Button variant="ghost" size="icon" asChild>
          <a 
            href="https://docs.lovable.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Help & Documentation"
          >
            <HelpCircle className="h-5 w-5" />
          </a>
        </Button>

        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Public Site
          </a>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.email ? getInitials(user.email) : "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

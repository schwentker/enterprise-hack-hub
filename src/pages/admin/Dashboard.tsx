import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UsersRound, FileText, Clock, Download, Bell, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Stats {
  registrations: number;
  teams: number;
  submissions: number;
  hoursUntilNext: number | null;
}

interface Activity {
  id: string;
  type: string;
  content: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    registrations: 66,
    teams: 11,
    submissions: 0,
    hoursUntilNext: null,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [prevRegistrations, setPrevRegistrations] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchActivities();

    const registrationsChannel = supabase
      .channel('registrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations'
        },
        () => {
          fetchStats();
          fetchActivities();
        }
      )
      .subscribe();

    const teamSeekersChannel = supabase
      .channel('team_seekers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_seekers'
        },
        () => fetchActivities()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(teamSeekersChannel);
    };
  }, []);

  const fetchStats = async () => {
    const { data: settings } = await supabase
      .from('event_settings')
      .select('next_phase_at')
      .single();

    let hoursUntil = null;
    if (settings?.next_phase_at) {
      const diff = new Date(settings.next_phase_at).getTime() - Date.now();
      hoursUntil = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    }

    setStats({
      registrations: 66,
      teams: 11,
      submissions: 0,
      hoursUntilNext: hoursUntil,
    });
  };

  const fetchActivities = async () => {
    const { data: recentRegistrations } = await supabase
      .from('registrations')
      .select('id, full_name, created_at, track')
      .order('created_at', { ascending: false })
      .limit(10);

    const activities: Activity[] = (recentRegistrations || []).map(reg => ({
      id: reg.id,
      type: 'registration',
      content: `${reg.full_name} registered for ${reg.track}`,
      time: reg.created_at,
    }));

    setActivities(activities);
  };

  const trend = stats.registrations - prevRegistrations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Dashboard snapshot of your hackathon</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registrations}</div>
            {trend !== 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {trend > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{trend} new</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{trend}</span>
                  </>
                )}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams Formed</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teams}</div>
            <p className="text-xs text-muted-foreground mt-1">Team seekers posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions Received</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions}</div>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Until Next Phase</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.hoursUntilNext !== null ? `${stats.hoursUntilNext}h` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Phase transition</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Registrations
        </Button>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Send Announcement
        </Button>
        <Button variant="outline" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Site
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">{activity.content}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

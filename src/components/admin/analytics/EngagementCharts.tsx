import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { differenceInDays, parseISO } from "date-fns";

interface EngagementChartsProps {
  registrations: any[];
  teams: any[];
}

const CHALLENGE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
];

export function EngagementCharts({ registrations, teams }: EngagementChartsProps) {
  // Most popular challenges
  const challengeCounts = registrations.reduce((acc, reg) => {
    reg.challenges.forEach((challenge: string) => {
      acc[challenge] = (acc[challenge] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const challengeData = Object.entries(challengeCounts)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 5);

  // Registration sources
  const sourceCounts = registrations.reduce((acc, reg) => {
    acc[reg.how_heard] = (acc[reg.how_heard] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => Number(b.value) - Number(a.value));

  // Time to team formation average
  const teamFormationTimes = teams
    .filter((team: any) => team.team_members && team.team_members.length > 0)
    .map((team: any) => {
      const teamCreated = parseISO(team.created_at);
      const earliestMemberJoined = team.team_members
        .map((m: any) => parseISO(m.joined_at))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0];
      
      return Math.abs(differenceInDays(earliestMemberJoined, teamCreated));
    })
    .filter((days: number) => days >= 0 && !isNaN(days));

  const avgTimeToTeam = teamFormationTimes.length > 0
    ? teamFormationTimes.reduce((sum: number, days: number) => sum + days, 0) / teamFormationTimes.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Popular Challenges */}
        <div>
          <h3 className="text-sm font-medium mb-4">Most Popular Challenges</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={challengeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip />
              <Bar dataKey="value" name="Interest Count">
                {challengeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHALLENGE_COLORS[index % CHALLENGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Registration Sources */}
        <div>
          <h3 className="text-sm font-medium mb-4">How Did You Hear About Us?</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time to Team Formation */}
      <div className="border rounded-lg p-6 bg-muted/30">
        <h3 className="text-sm font-medium mb-2">Average Time to Team Formation</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{avgTimeToTeam.toFixed(1)}</span>
          <span className="text-muted-foreground">days</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Based on {teamFormationTimes.length} teams formed
        </p>
      </div>
    </div>
  );
}

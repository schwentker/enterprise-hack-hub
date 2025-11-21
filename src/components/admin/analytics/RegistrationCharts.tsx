import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface RegistrationChartsProps {
  registrations: any[];
  teams: any[];
  submissions: any[];
}

const COLORS = {
  Promptathon: "#3b82f6",
  Buildathon: "#a855f7",
  Vibeathon: "#ec4899",
  Solo: "#94a3b8",
  Looking: "#fb923c",
  "Has Team": "#22c55e",
};

export function RegistrationCharts({ registrations, teams, submissions }: RegistrationChartsProps) {
  // Registrations over time (cumulative)
  const registrationsOverTime = registrations.reduce((acc, reg, index) => {
    const date = format(parseISO(reg.created_at), "MMM dd");
    const existing = acc.find((item) => item.date === date);
    
    if (existing) {
      existing.count = index + 1;
    } else {
      acc.push({ date, count: index + 1 });
    }
    
    return acc;
  }, [] as { date: string; count: number }[]);

  // Registrations by track
  const byTrack = registrations.reduce((acc, reg) => {
    acc[reg.track] = (acc[reg.track] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trackData = Object.entries(byTrack).map(([name, value]) => ({
    name,
    value,
  }));

  // Registrations by role
  const byRole = registrations.reduce((acc, reg) => {
    acc[reg.role] = (acc[reg.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = Object.entries(byRole).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Team status distribution
  const byTeamStatus = registrations.reduce((acc, reg) => {
    const status = reg.team_status === "has-team" ? "Has Team" : 
                   reg.team_status === "looking" ? "Looking" : "Solo";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamStatusData = Object.entries(byTeamStatus).map(([name, value]) => ({
    name,
    value,
  }));

  // Funnel data
  const registered = registrations.length;
  const formedTeam = teams.reduce((sum, team) => sum + (team.team_members?.length || 0), 0);
  const submitted = submissions.length;
  const won = submissions.filter((s: any) => s.awards && s.awards.length > 0).length;

  const funnelData = [
    { name: "Registered", value: registered, fill: "#3b82f6" },
    { name: "Formed Team", value: formedTeam, fill: "#8b5cf6" },
    { name: "Submitted", value: submitted, fill: "#ec4899" },
    { name: "Won Award", value: won, fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      {/* Registrations Over Time */}
      <div>
        <h3 className="text-sm font-medium mb-4">Registrations Over Time (Cumulative)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={registrationsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total Registrations"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registrations by Track */}
        <div>
          <h3 className="text-sm font-medium mb-4">Registrations by Track</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trackData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Registrations">
                {trackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Registrations by Role */}
        <div>
          <h3 className="text-sm font-medium mb-4">Registrations by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Status Distribution */}
        <div>
          <h3 className="text-sm font-medium mb-4">Team Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {teamStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div>
          <h3 className="text-sm font-medium mb-4">Participant Journey Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" name="Count">
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

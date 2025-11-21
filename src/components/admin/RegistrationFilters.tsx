import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface RegistrationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  trackFilter: string[];
  onTrackFilterChange: (value: string[]) => void;
  teamStatusFilter: string[];
  onTeamStatusFilterChange: (value: string[]) => void;
  challengeFilter: string[];
  onChallengeFilterChange: (value: string[]) => void;
}

const tracks = ["Promptathon", "Buildathon", "Vibeathon"];
const teamStatuses = ["Solo", "Looking", "Has Team"];
const challenges = [
  "AI-Powered Customer Support",
  "Smart Document Analysis",
  "Automated Code Review",
  "Predictive Analytics Dashboard",
  "Content Generation Suite",
];

export function RegistrationFilters({
  searchQuery,
  onSearchChange,
  trackFilter,
  onTrackFilterChange,
  teamStatusFilter,
  onTeamStatusFilterChange,
  challengeFilter,
  onChallengeFilterChange,
}: RegistrationFiltersProps) {
  const toggleFilter = (
    value: string,
    currentFilters: string[],
    onChange: (value: string[]) => void
  ) => {
    if (currentFilters.includes(value)) {
      onChange(currentFilters.filter((v) => v !== value));
    } else {
      onChange([...currentFilters, value]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Name, email, company..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Track</Label>
          <div className="space-y-2">
            {tracks.map((track) => (
              <div key={track} className="flex items-center space-x-2">
                <Checkbox
                  id={`track-${track}`}
                  checked={trackFilter.includes(track)}
                  onCheckedChange={() =>
                    toggleFilter(track, trackFilter, onTrackFilterChange)
                  }
                />
                <label
                  htmlFor={`track-${track}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {track}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Team Status</Label>
          <div className="space-y-2">
            {teamStatuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={teamStatusFilter.includes(status)}
                  onCheckedChange={() =>
                    toggleFilter(status, teamStatusFilter, onTeamStatusFilterChange)
                  }
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Challenge Interests</Label>
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <div key={challenge} className="flex items-center space-x-2">
                <Checkbox
                  id={`challenge-${challenge}`}
                  checked={challengeFilter.includes(challenge)}
                  onCheckedChange={() =>
                    toggleFilter(challenge, challengeFilter, onChallengeFilterChange)
                  }
                />
                <label
                  htmlFor={`challenge-${challenge}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {challenge}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, UserPlus, Search } from "lucide-react";
import type { Team } from "@/pages/admin/Teams";

interface TeamSeeker {
  id: string;
  user_name: string;
  email: string;
  track: string;
  role: string;
  skills_offered: string[];
  skills_needed: string[];
  created_at: string;
}

interface MatchingQueueProps {
  seekers: TeamSeeker[];
  teams: Team[];
  onUpdate: () => void;
}

const tracks = ["Promptathon", "Buildathon", "Vibeathon"];

export function MatchingQueue({ seekers, teams, onUpdate }: MatchingQueueProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState<string[]>([]);
  const [selectedSeekers, setSelectedSeekers] = useState<string[]>([]);

  const filteredSeekers = seekers.filter((seeker) => {
    const matchesSearch =
      searchQuery === "" ||
      seeker.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seeker.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrack =
      trackFilter.length === 0 || trackFilter.includes(seeker.track);

    return matchesSearch && matchesTrack;
  });

  const toggleTrackFilter = (track: string) => {
    if (trackFilter.includes(track)) {
      setTrackFilter(trackFilter.filter((t) => t !== track));
    } else {
      setTrackFilter([...trackFilter, track]);
    }
  };

  const toggleSeeker = (id: string) => {
    if (selectedSeekers.includes(id)) {
      setSelectedSeekers(selectedSeekers.filter((s) => s !== id));
    } else {
      setSelectedSeekers([...selectedSeekers, id]);
    }
  };

  const createTeamFromSelected = async () => {
    if (selectedSeekers.length === 0) {
      toast({
        title: "No members selected",
        description: "Select at least one person to create a team",
        variant: "destructive",
      });
      return;
    }

    const firstSeeker = seekers.find((s) => s.id === selectedSeekers[0]);
    if (!firstSeeker) return;

    try {
      // Create team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: `Team ${firstSeeker.track}`,
          track: firstSeeker.track,
          status: "forming",
        })
        .select()
        .single();

      if (teamError) throw teamError;

      toast({
        title: "Team created!",
        description: `Created ${team.name} with ${selectedSeekers.length} member(s)`,
      });

      setSelectedSeekers([]);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const suggestMatches = (seeker: TeamSeeker) => {
    const suggestions = seekers.filter((other) => {
      if (other.id === seeker.id) return false;
      
      // Same track
      if (other.track !== seeker.track) return false;

      // Check for complementary skills
      const hasComplementarySkills = seeker.skills_needed.some((skill) =>
        other.skills_offered.includes(skill)
      );

      return hasComplementarySkills;
    });

    if (suggestions.length === 0) {
      toast({
        title: "No matches found",
        description: "No compatible teammates found for this person",
      });
    } else {
      // Select the suggested matches
      setSelectedSeekers([seeker.id, ...suggestions.map((s) => s.id)]);
      toast({
        title: "Matches suggested!",
        description: `Found ${suggestions.length} compatible teammate(s)`,
      });
    }
  };

  if (seekers.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No One Looking for Teams</h3>
        <p className="text-muted-foreground">
          People marked as "Looking for Team" will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seeker-search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="seeker-search"
                placeholder="Name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Track</Label>
            <div className="flex gap-2">
              {tracks.map((track) => (
                <div key={track} className="flex items-center space-x-2">
                  <Checkbox
                    id={`track-${track}`}
                    checked={trackFilter.includes(track)}
                    onCheckedChange={() => toggleTrackFilter(track)}
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

          {selectedSeekers.length > 0 && (
            <Button onClick={createTeamFromSelected} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Team from Selected ({selectedSeekers.length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Seekers List */}
      <div className="space-y-3">
        {filteredSeekers.map((seeker) => (
          <Card
            key={seeker.id}
            className={`cursor-pointer transition-colors ${
              selectedSeekers.includes(seeker.id) ? "border-primary" : ""
            }`}
            onClick={() => toggleSeeker(seeker.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Checkbox
                      checked={selectedSeekers.includes(seeker.id)}
                      onCheckedChange={() => toggleSeeker(seeker.id)}
                    />
                    <div>
                      <h3 className="font-medium">{seeker.user_name}</h3>
                      <p className="text-sm text-muted-foreground">{seeker.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{seeker.track}</Badge>
                    <Badge variant="secondary">{seeker.role}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {seeker.skills_offered.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Offers: </span>
                        <span>{seeker.skills_offered.join(", ")}</span>
                      </div>
                    )}
                    {seeker.skills_needed.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Needs: </span>
                        <span>{seeker.skills_needed.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    suggestMatches(seeker);
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Suggest Match
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

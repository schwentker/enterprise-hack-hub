import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import type { Submission } from "@/pages/admin/Submissions";

interface LeaderboardProps {
  submissions: Submission[];
  onSubmissionClick: (submission: Submission) => void;
}

const tracks = ["Promptathon", "Buildathon", "Vibeathon"];

const trackColors: Record<string, string> = {
  Promptathon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Buildathon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Vibeathon: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

export function Leaderboard({ submissions, onSubmissionClick }: LeaderboardProps) {
  const [trackFilter, setTrackFilter] = useState<string[]>([]);

  const toggleTrackFilter = (track: string) => {
    if (trackFilter.includes(track)) {
      setTrackFilter(trackFilter.filter((t) => t !== track));
    } else {
      setTrackFilter([...trackFilter, track]);
    }
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter((s) => s.average_score && s.average_score > 0)
    .filter((s) => trackFilter.length === 0 || trackFilter.includes(s.team?.track || ""))
    .sort((a, b) => (b.average_score || 0) - (a.average_score || 0));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (rank === 2) return "bg-gray-400/10 text-gray-400 border-gray-400/20";
    if (rank === 3) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    return "";
  };

  if (filteredSubmissions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Scored Submissions</h3>
        <p className="text-muted-foreground">
          Submissions will appear here once they've been scored
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>Filter by Track</Label>
            <div className="flex gap-2">
              {tracks.map((track) => (
                <div key={track} className="flex items-center space-x-2">
                  <Checkbox
                    id={`leaderboard-track-${track}`}
                    checked={trackFilter.includes(track)}
                    onCheckedChange={() => toggleTrackFilter(track)}
                  />
                  <label
                    htmlFor={`leaderboard-track-${track}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {track}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <div className="space-y-3">
        {filteredSubmissions.map((submission, index) => {
          const rank = index + 1;
          const hasAward = submission.awards && submission.awards.length > 0;

          return (
            <Card
              key={submission.id}
              className={`cursor-pointer hover:border-primary transition-colors ${
                rank <= 3 ? "border-2" : ""
              } ${rank === 1 ? "border-yellow-500" : ""} ${
                rank === 2 ? "border-gray-400" : ""
              } ${rank === 3 ? "border-orange-500" : ""}`}
              onClick={() => onSubmissionClick(submission)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(rank) || (
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">
                        {submission.project_name}
                      </h3>
                      {hasAward && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      by {submission.team?.name}
                    </p>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={trackColors[submission.team?.track || ""]}
                      >
                        {submission.team?.track}
                      </Badge>
                      {submission.team?.challenge && (
                        <Badge variant="secondary">{submission.team.challenge}</Badge>
                      )}
                      {hasAward &&
                        submission.awards?.map((award) => (
                          <Badge
                            key={award.id}
                            variant="outline"
                            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          >
                            {award.award_type}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        rank <= 3 ? getRankBadge(rank).split(" ")[1] : ""
                      }`}
                    >
                      {submission.average_score?.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">/10</div>
                    {submission.scores && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {submission.scores.length} judge(s)
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Publish Button */}
      <div className="flex justify-center pt-4">
        <Button size="lg">
          <Trophy className="mr-2 h-5 w-5" />
          Publish Results to Public Site
        </Button>
      </div>
    </div>
  );
}

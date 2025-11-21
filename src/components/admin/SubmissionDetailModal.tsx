import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Trophy, Award } from "lucide-react";
import { format } from "date-fns";
import type { Submission } from "@/pages/admin/Submissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubmissionDetailModalProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const trackColors: Record<string, string> = {
  Promptathon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Buildathon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Vibeathon: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const statusColors: Record<string, string> = {
  pending_review: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  in_judging: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  scored: "bg-green-500/10 text-green-500 border-green-500/20",
  winner: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const awardTypes = [
  "Grand Prize",
  "Track Winner - Promptathon",
  "Track Winner - Buildathon",
  "Track Winner - Vibeathon",
  "Best Innovation",
  "Best UX",
  "Best Business Impact",
  "Best Use of Lovable",
  "People's Choice",
];

export function SubmissionDetailModal({
  submission,
  open,
  onOpenChange,
  onUpdate,
}: SubmissionDetailModalProps) {
  const { toast } = useToast();
  const [selectedAwardType, setSelectedAwardType] = useState<string>("");

  if (!submission) return null;

  const handleAddAward = async () => {
    if (!selectedAwardType) return;

    try {
      const { error } = await supabase.from("awards").insert({
        submission_id: submission.id,
        award_type: selectedAwardType,
      });

      if (error) throw error;

      // Update submission status to winner
      await supabase
        .from("submissions")
        .update({ status: "winner" })
        .eq("id", submission.id);

      toast({
        title: "Award added!",
        description: `${selectedAwardType} awarded to ${submission.project_name}`,
      });

      setSelectedAwardType("");
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveAward = async (awardId: string) => {
    try {
      const { error } = await supabase.from("awards").delete().eq("id", awardId);

      if (error) throw error;

      toast({
        title: "Award removed",
        description: "Award has been removed from this submission",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const criteriaScores = submission.scores
    ? {
        innovation:
          submission.scores.reduce((sum, s) => sum + s.innovation_score, 0) /
          submission.scores.length,
        quality:
          submission.scores.reduce((sum, s) => sum + s.quality_score, 0) /
          submission.scores.length,
        impact:
          submission.scores.reduce((sum, s) => sum + s.impact_score, 0) /
          submission.scores.length,
        platform:
          submission.scores.reduce((sum, s) => sum + s.platform_score, 0) /
          submission.scores.length,
      }
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{submission.project_name}</DialogTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className={trackColors[submission.team?.track || ""]}>
                {submission.team?.track}
              </Badge>
              <Badge variant="outline" className={statusColors[submission.status]}>
                {submission.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team & Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Team</Label>
              <p className="text-lg font-medium">{submission.team?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Submitted</Label>
              <p className="text-lg font-medium">
                {format(new Date(submission.submitted_at), "PPpp")}
              </p>
            </div>
          </div>

          {submission.description && (
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-1">{submission.description}</p>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            <Label>Project Links</Label>
            <div className="flex flex-wrap gap-2">
              {submission.demo_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(submission.demo_link!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Demo
                </Button>
              )}
              {submission.repo_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(submission.repo_link!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Repository
                </Button>
              )}
              {submission.video_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(submission.video_link!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Video
                </Button>
              )}
              {submission.slides_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(submission.slides_link!, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Slides
                </Button>
              )}
            </div>
          </div>

          {/* Demo Preview */}
          {submission.demo_link && (
            <div>
              <Label className="text-muted-foreground mb-2 block">Demo Preview</Label>
              <div className="border rounded-lg overflow-hidden bg-muted/50">
                <iframe
                  src={submission.demo_link}
                  className="w-full h-96"
                  title="Project Demo"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Scores */}
          {submission.scores && submission.scores.length > 0 && (
            <div className="space-y-4">
              <Label>Judge Scores</Label>

              {/* Average Scores by Criteria */}
              {criteriaScores && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Innovation</p>
                    <p className="text-2xl font-bold">{criteriaScores.innovation.toFixed(1)}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Product Quality</p>
                    <p className="text-2xl font-bold">{criteriaScores.quality.toFixed(1)}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Business Impact</p>
                    <p className="text-2xl font-bold">{criteriaScores.impact.toFixed(1)}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Platform Usage</p>
                    <p className="text-2xl font-bold">{criteriaScores.platform.toFixed(1)}</p>
                  </div>
                </div>
              )}

              {/* Individual Judge Scores */}
              <div className="space-y-3">
                {submission.scores.map((score) => (
                  <div key={score.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Judge {score.judge_id.slice(0, 8)}...</p>
                      <p className="text-lg font-bold">
                        {((score.innovation_score + score.quality_score + score.impact_score + score.platform_score) / 4).toFixed(1)}/10
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Innovation:</span>{" "}
                        <span className="font-medium">{score.innovation_score}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quality:</span>{" "}
                        <span className="font-medium">{score.quality_score}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact:</span>{" "}
                        <span className="font-medium">{score.impact_score}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Platform:</span>{" "}
                        <span className="font-medium">{score.platform_score}</span>
                      </div>
                    </div>
                    {score.comments && (
                      <p className="text-sm text-muted-foreground italic">"{score.comments}"</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Final Average */}
              <div className="border-2 border-primary rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Final Average Score</p>
                <p className="text-4xl font-bold">{submission.average_score?.toFixed(2)}/10</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Awards */}
          <div className="space-y-4">
            <Label>Awards</Label>

            {submission.awards && submission.awards.length > 0 && (
              <div className="space-y-2">
                {submission.awards.map((award) => (
                  <div key={award.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">{award.award_type}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAward(award.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Select value={selectedAwardType} onValueChange={setSelectedAwardType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select award type..." />
                </SelectTrigger>
                <SelectContent>
                  {awardTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddAward} disabled={!selectedAwardType}>
                <Award className="mr-2 h-4 w-4" />
                Add Award
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Leaderboard } from "@/components/admin/Leaderboard";
import { SubmissionDetailModal } from "@/components/admin/SubmissionDetailModal";
import { Trophy, Award, Star, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Submission {
  id: string;
  team_id: string;
  project_name: string;
  description: string | null;
  demo_link: string | null;
  repo_link: string | null;
  video_link: string | null;
  slides_link: string | null;
  status: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  team?: {
    name: string;
    track: string;
    challenge: string | null;
  };
  scores?: Score[];
  awards?: Award[];
  average_score?: number;
}

export interface Score {
  id: string;
  submission_id: string;
  judge_id: string;
  innovation_score: number;
  quality_score: number;
  impact_score: number;
  platform_score: number;
  comments: string | null;
  scored_at: string;
}

export interface Award {
  id: string;
  submission_id: string;
  award_type: string;
  awarded_at: string;
}

export default function Submissions() {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [view, setView] = useState<"submissions" | "leaderboard">("submissions");

  const { data: submissions = [], refetch } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          teams (
            name,
            track,
            challenge
          ),
          scores (*),
          awards (*)
        `)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      return data.map((submission) => {
        const scores = submission.scores as Score[];
        const average_score = scores.length > 0
          ? scores.reduce((sum, s) => sum + (s.innovation_score + s.quality_score + s.impact_score + s.platform_score) / 4, 0) / scores.length
          : 0;

        return {
          ...submission,
          team: submission.teams,
          average_score,
        };
      }) as Submission[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("submissions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        () => {
          refetch();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scores",
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Calculate metrics
  const totalSubmissions = submissions.length;
  const pendingReview = submissions.filter((s) => s.status === "pending_review").length;
  const inJudging = submissions.filter((s) => s.status === "in_judging").length;
  const scored = submissions.filter((s) => s.status === "scored").length;
  const winners = submissions.filter((s) => s.awards && s.awards.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Submissions & Judging</h1>
          <p className="text-muted-foreground">Review projects and manage scoring</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Judging</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inJudging}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winners</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winners}</div>
          </CardContent>
        </Card>
      </div>

      {/* Views Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as "submissions" | "leaderboard")}>
        <TabsList>
          <TabsTrigger value="submissions">All Submissions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6">
          <SubmissionsTable
            submissions={submissions}
            onSubmissionClick={setSelectedSubmission}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Leaderboard submissions={submissions} onSubmissionClick={setSelectedSubmission} />
        </TabsContent>
      </Tabs>

      <SubmissionDetailModal
        submission={selectedSubmission}
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
        onUpdate={refetch}
      />
    </div>
  );
}

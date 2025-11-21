import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Submission } from "@/pages/admin/Submissions";

interface SubmissionsTableProps {
  submissions: Submission[];
  onSubmissionClick: (submission: Submission) => void;
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

export function SubmissionsTable({ submissions, onSubmissionClick }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <p className="text-muted-foreground">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Challenge</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Avg Score</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow
              key={submission.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSubmissionClick(submission)}
            >
              <TableCell className="font-medium">{submission.team?.name}</TableCell>
              <TableCell>{submission.project_name}</TableCell>
              <TableCell>
                <Badge variant="outline" className={trackColors[submission.team?.track || ""]}>
                  {submission.team?.track}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {submission.team?.challenge || "—"}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[submission.status]}>
                  {submission.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {submission.average_score ? (
                  <span className="font-medium">{submission.average_score.toFixed(1)}/10</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onSubmissionClick(submission)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {submission.demo_link && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(submission.demo_link!, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

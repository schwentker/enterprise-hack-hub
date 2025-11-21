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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserMinus, Save } from "lucide-react";
import { format } from "date-fns";
import type { Team } from "@/pages/admin/Teams";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamDetailModalProps {
  team: Team | null;
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
  forming: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  complete: "bg-green-500/10 text-green-500 border-green-500/20",
  building: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  submitted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export function TeamDetailModal({
  team,
  open,
  onOpenChange,
  onUpdate,
}: TeamDetailModalProps) {
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!team) return null;

  const handleSaveNote = async () => {
    if (!note.trim()) return;

    try {
      const { error } = await supabase.from("team_notes").insert({
        team_id: team.id,
        note: note.trim(),
      });

      if (error) throw error;

      toast({
        title: "Note saved",
        description: "Team note has been added",
      });

      setNote("");
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: "Team member has been removed",
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

  const handleDeleteTeam = async () => {
    try {
      const { error } = await supabase.from("teams").delete().eq("id", team.id);

      if (error) throw error;

      toast({
        title: "Team dissolved",
        description: "The team has been deleted",
      });

      onOpenChange(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{team.name}</DialogTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={trackColors[team.track]}>
                  {team.track}
                </Badge>
                <Badge variant="outline" className={statusColors[team.status]}>
                  {team.status}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Team Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Members</Label>
                <p className="text-lg font-medium">
                  {team.members?.length || 0}/{team.max_members}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p className="text-lg font-medium">
                  {format(new Date(team.created_at), "PPP")}
                </p>
              </div>
            </div>

            {team.challenge && (
              <div>
                <Label className="text-muted-foreground">Challenge</Label>
                <p className="font-medium">{team.challenge}</p>
              </div>
            )}

            <Separator />

            {/* Members List */}
            <div className="space-y-2">
              <Label>Team Members</Label>
              {team.members && team.members.length > 0 ? (
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {member.registration?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.registration?.email}
                        </p>
                        {member.role && (
                          <Badge variant="secondary" className="mt-1">
                            {member.role}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No members yet</p>
              )}
            </div>

            <Separator />

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="team-note">Add Progress Note</Label>
              <Textarea
                id="team-note"
                placeholder="Add notes about team progress, decisions, or issues..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSaveNote} disabled={!note.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-2">
              <Label className="text-destructive">Danger Zone</Label>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Dissolve Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team "{team.name}" and remove all
              member associations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

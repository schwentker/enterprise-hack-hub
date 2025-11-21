import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Trash2, Archive } from "lucide-react";
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

export function DangerZoneSettings() {
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleResetEvent = async () => {
    try {
      // Delete in order to respect foreign key constraints
      await supabase.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("awards").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("submissions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("teams").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("team_seekers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      toast({
        title: "Event reset complete",
        description: "All registrations, teams, and submissions have been cleared",
      });

      setShowResetDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleArchiveEvent = async () => {
    try {
      const { error } = await supabase
        .from("event_settings")
        .update({ event_status: "archived" })
        .eq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast({
        title: "Event archived",
        description: "Event is now in read-only mode",
      });

      setShowArchiveDialog(false);
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
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that affect the entire event
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium">Reset Event</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Clear all registrations, teams, and submissions. Event settings will be preserved.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium">Archive Event</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Put event in read-only mode. No new registrations or submissions will be accepted.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setShowArchiveDialog(true)}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>

          <div className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg">
            <div>
              <h4 className="font-medium">Delete Event</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete the entire event including all data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all registrations, teams, and submissions.
              Event settings and configuration will be preserved. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will put the event in read-only mode. No new registrations or
              submissions will be accepted. You can unarchive it later from settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveEvent}>
              Archive Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the entire event including all settings,
              registrations, teams, submissions, and data. This action cannot be undone.
              Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast({
                  title: "Not implemented",
                  description: "Event deletion requires additional confirmation",
                });
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

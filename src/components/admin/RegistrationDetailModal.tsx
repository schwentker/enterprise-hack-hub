import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Mail, Calendar } from "lucide-react";
import type { Registration } from "@/pages/admin/Registrations";

interface RegistrationDetailModalProps {
  registration: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const trackColors: Record<string, string> = {
  promptathon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  buildathon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  vibeathon: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const teamStatusColors: Record<string, string> = {
  solo: "bg-muted text-muted-foreground",
  looking: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "has-team": "bg-green-500/10 text-green-500 border-green-500/20",
};

export function RegistrationDetailModal({
  registration,
  open,
  onOpenChange,
}: RegistrationDetailModalProps) {
  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Registration #{registration.registration_number}</span>
            <Badge variant="outline" className="ml-2">
              {format(new Date(registration.created_at), "PPP")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Full Name</Label>
              <p className="text-lg font-medium">{registration.full_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <div className="flex items-center gap-2">
                <p className="text-lg">{registration.email}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Company</Label>
              <p className="font-medium">{registration.company || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <p className="font-medium capitalize">{registration.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Experience Level</Label>
              <p className="font-medium capitalize">{registration.experience_level}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">How They Heard</Label>
              <p className="font-medium">{registration.how_heard}</p>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Track</Label>
              <div className="mt-1">
                <Badge variant="outline" className={trackColors[registration.track.toLowerCase()]}>
                  {registration.track}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Team Status</Label>
              <div className="mt-1">
                <Badge variant="outline" className={teamStatusColors[registration.team_status.toLowerCase()]}>
                  {registration.team_status.replace("-", " ")}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Challenge Interests</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {registration.challenges.map((challenge) => (
                  <Badge key={challenge} variant="secondary">
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Agreement */}
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${registration.agreed_to_code_of_conduct ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
              {registration.agreed_to_code_of_conduct && (
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <Label className="text-muted-foreground">Agreed to Code of Conduct</Label>
          </div>

          <Separator />

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add internal notes about this registration..."
              rows={4}
            />
            <Button size="sm">Save Notes</Button>
          </div>

          <Separator />

          {/* Registration Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Registered: {format(new Date(registration.created_at), "PPpp")}</span>
            </div>
            <div>
              <span>ID: {registration.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

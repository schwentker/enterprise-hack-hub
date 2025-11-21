import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const phases = ["Setup", "Registration", "Team Formation", "Building", "Submission", "Judging", "Complete"];

export function EventConfigurationSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data: settings, refetch } = useQuery({
    queryKey: ["event-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    event_name: settings?.event_name || "",
    current_phase: settings?.current_phase || "Setup",
    auto_advance_phases: settings?.auto_advance_phases || false,
    event_start_date: settings?.event_start_date ? new Date(settings.event_start_date) : undefined,
    event_end_date: settings?.event_end_date ? new Date(settings.event_end_date) : undefined,
    registration_deadline: settings?.registration_deadline ? new Date(settings.registration_deadline) : undefined,
    submission_deadline: settings?.submission_deadline ? new Date(settings.submission_deadline) : undefined,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("event_settings")
        .update({
          event_name: formData.event_name,
          current_phase: formData.current_phase,
          auto_advance_phases: formData.auto_advance_phases,
          event_start_date: formData.event_start_date?.toISOString(),
          event_end_date: formData.event_end_date?.toISOString(),
          registration_deadline: formData.registration_deadline?.toISOString(),
          submission_deadline: formData.submission_deadline?.toISOString(),
        })
        .eq("id", settings?.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Event configuration has been updated",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="event-name">Event Name</Label>
          <Input
            id="event-name"
            value={formData.event_name}
            onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
            placeholder="Lovable Enterprise Hacks"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.event_start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.event_start_date ? format(formData.event_start_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.event_start_date}
                  onSelect={(date) => setFormData({ ...formData, event_start_date: date })}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Event End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.event_end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.event_end_date ? format(formData.event_end_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.event_end_date}
                  onSelect={(date) => setFormData({ ...formData, event_end_date: date })}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Registration Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.registration_deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.registration_deadline ? format(formData.registration_deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.registration_deadline}
                  onSelect={(date) => setFormData({ ...formData, registration_deadline: date })}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Submission Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.submission_deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.submission_deadline ? format(formData.submission_deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.submission_deadline}
                  onSelect={(date) => setFormData({ ...formData, submission_deadline: date })}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-phase">Current Phase</Label>
          <Select
            value={formData.current_phase}
            onValueChange={(value) => setFormData({ ...formData, current_phase: value })}
          >
            <SelectTrigger id="current-phase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {phases.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="auto-advance"
            checked={formData.auto_advance_phases}
            onCheckedChange={(checked) => setFormData({ ...formData, auto_advance_phases: checked })}
          />
          <Label htmlFor="auto-advance" className="cursor-pointer">
            Auto-advance phases based on time
          </Label>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}

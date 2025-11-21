import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface NotificationTemplate {
  id: string;
  template_type: string;
  subject: string;
  body: string;
}

const templateLabels: Record<string, { title: string; description: string }> = {
  registration_confirmation: {
    title: "Registration Confirmation",
    description: "Sent when someone registers for the event",
  },
  team_formation_reminder: {
    title: "Team Formation Reminder",
    description: "Sent to remind participants to form teams",
  },
  submission_reminder: {
    title: "Submission Reminder",
    description: "Sent to remind teams to submit their projects",
  },
  winner_announcement: {
    title: "Winner Announcement",
    description: "Sent to announce winners",
  },
};

export function NotificationTemplatesSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);

  const { data: templates = [], refetch } = useQuery({
    queryKey: ["notification-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_templates")
        .select("*");

      if (error) throw error;
      return data as NotificationTemplate[];
    },
  });

  const [editedTemplates, setEditedTemplates] = useState<
    Record<string, { subject: string; body: string }>
  >({});

  const handleUpdate = (id: string, field: "subject" | "body", value: string) => {
    setEditedTemplates({
      ...editedTemplates,
      [id]: {
        ...editedTemplates[id],
        [field]: value,
      },
    });
  };

  const handleSave = async (template: NotificationTemplate) => {
    setSaving(template.id);
    try {
      const updates = editedTemplates[template.id];
      if (!updates) return;

      const { error } = await supabase
        .from("notification_templates")
        .update({
          subject: updates.subject,
          body: updates.body,
        })
        .eq("id", template.id);

      if (error) throw error;

      toast({
        title: "Template saved",
        description: "Notification template has been updated",
      });

      // Remove from edited templates
      const newEdited = { ...editedTemplates };
      delete newEdited[template.id];
      setEditedTemplates(newEdited);
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
        <CardDescription>
          Customize email templates. Available variables: {"{"}
          {"{"}event_name{"}"}, {"{"}name{"}"}, {"{"}registration_number{"}"}, {"{"}
          track{"}"}, {"{"}team_name{"}"}, {"{"}project_name{"}"}, {"{"}award_type
          {"}"}, {"{"}prize_amount{"}"}, {"{"}days_left{"}"}, {"{"}deadline{"}"}
          {"}"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {templates.map((template) => {
            const label = templateLabels[template.template_type];
            const edited = editedTemplates[template.id];
            
            return (
              <AccordionItem key={template.id} value={template.id}>
                <AccordionTrigger>
                  <div>
                    <h4 className="font-medium">{label?.title || template.template_type}</h4>
                    <p className="text-sm text-muted-foreground text-left">
                      {label?.description}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`subject-${template.id}`}>Email Subject</Label>
                      <Input
                        id={`subject-${template.id}`}
                        value={edited?.subject ?? template.subject}
                        onChange={(e) =>
                          handleUpdate(template.id, "subject", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`body-${template.id}`}>Email Body</Label>
                      <Textarea
                        id={`body-${template.id}`}
                        value={edited?.body ?? template.body}
                        onChange={(e) =>
                          handleUpdate(template.id, "body", e.target.value)
                        }
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>

                    <Button
                      onClick={() => handleSave(template)}
                      disabled={saving === template.id || !editedTemplates[template.id]}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

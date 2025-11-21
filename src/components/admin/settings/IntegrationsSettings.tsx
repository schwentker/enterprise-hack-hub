import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface Integration {
  id: string;
  integration_type: string;
  webhook_url: string | null;
  enabled: boolean;
}

export function IntegrationsSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data: integrations = [], refetch } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("integrations").select("*");

      if (error) throw error;
      return data as Integration[];
    },
  });

  const [slackWebhook, setSlackWebhook] = useState("");
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [discordEnabled, setDiscordEnabled] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert Slack integration
      const { error: slackError } = await supabase
        .from("integrations")
        .upsert({
          integration_type: "slack",
          webhook_url: slackWebhook || null,
          enabled: slackEnabled,
        }, { onConflict: "integration_type" });

      if (slackError) throw slackError;

      // Upsert Discord integration
      const { error: discordError } = await supabase
        .from("integrations")
        .upsert({
          integration_type: "discord",
          webhook_url: discordWebhook || null,
          enabled: discordEnabled,
        }, { onConflict: "integration_type" });

      if (discordError) throw discordError;

      toast({
        title: "Integrations saved",
        description: "Integration settings have been updated",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Slack Integration</CardTitle>
          <CardDescription>
            Send notifications to Slack when key events occur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slack-webhook">Webhook URL</Label>
            <Input
              id="slack-webhook"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              type="url"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="slack-enabled"
              checked={slackEnabled}
              onCheckedChange={setSlackEnabled}
            />
            <Label htmlFor="slack-enabled" className="cursor-pointer">
              Enable Slack notifications
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discord Integration</CardTitle>
          <CardDescription>
            Send notifications to Discord when key events occur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discord-webhook">Webhook URL</Label>
            <Input
              id="discord-webhook"
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              type="url"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="discord-enabled"
              checked={discordEnabled}
              onCheckedChange={setDiscordEnabled}
            />
            <Label htmlFor="discord-enabled" className="cursor-pointer">
              Enable Discord notifications
            </Label>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        Save Integrations
      </Button>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventConfigurationSettings } from "@/components/admin/settings/EventConfigurationSettings";
import { ChallengeManagementSettings } from "@/components/admin/settings/ChallengeManagementSettings";
import { PrizeConfigurationSettings } from "@/components/admin/settings/PrizeConfigurationSettings";
import { NotificationTemplatesSettings } from "@/components/admin/settings/NotificationTemplatesSettings";
import { IntegrationsSettings } from "@/components/admin/settings/IntegrationsSettings";
import { DangerZoneSettings } from "@/components/admin/settings/DangerZoneSettings";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage event configuration and preferences</p>
      </div>

      <Tabs defaultValue="event" className="space-y-6">
        <TabsList>
          <TabsTrigger value="event">Event</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="prizes">Prizes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="event">
          <EventConfigurationSettings />
        </TabsContent>

        <TabsContent value="challenges">
          <ChallengeManagementSettings />
        </TabsContent>

        <TabsContent value="prizes">
          <PrizeConfigurationSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationTemplatesSettings />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSettings />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZoneSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

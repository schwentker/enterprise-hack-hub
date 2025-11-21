import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Challenge {
  id: string;
  name: string;
  description: string | null;
  sponsor: string | null;
  prize_amount: number | null;
  recommended_track: string | null;
  display_order: number;
}

export function ChallengeManagementSettings() {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const { data: challenges = [], refetch } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Challenge[];
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sponsor: "",
    prize_amount: "",
    recommended_track: "",
  });

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from("challenges").insert({
        name: formData.name,
        description: formData.description || null,
        sponsor: formData.sponsor || null,
        prize_amount: formData.prize_amount ? parseFloat(formData.prize_amount) : null,
        recommended_track: formData.recommended_track || null,
        display_order: challenges.length,
      });

      if (error) throw error;

      toast({
        title: "Challenge added",
        description: "New challenge has been created",
      });

      setFormData({ name: "", description: "", sponsor: "", prize_amount: "", recommended_track: "" });
      setShowAddDialog(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("challenges").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Challenge deleted",
        description: "Challenge has been removed",
      });

      refetch();
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Challenge Management</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Challenge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No challenges configured yet
            </div>
          ) : (
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">{challenge.name}</h4>
                    {challenge.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {challenge.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {challenge.sponsor && (
                        <span className="text-xs px-2 py-1 bg-muted rounded">
                          Sponsor: {challenge.sponsor}
                        </span>
                      )}
                      {challenge.prize_amount && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          ${challenge.prize_amount.toLocaleString()}
                        </span>
                      )}
                      {challenge.recommended_track && (
                        <span className="text-xs px-2 py-1 bg-secondary rounded">
                          {challenge.recommended_track}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(challenge.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Challenge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-name">Challenge Name</Label>
              <Input
                id="challenge-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="AI-Powered Customer Support"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge-description">Description</Label>
              <Textarea
                id="challenge-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Build an intelligent customer support system..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge-sponsor">Sponsor (optional)</Label>
              <Input
                id="challenge-sponsor"
                value={formData.sponsor}
                onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                placeholder="Company Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge-prize">Prize Amount (optional)</Label>
              <Input
                id="challenge-prize"
                type="number"
                value={formData.prize_amount}
                onChange={(e) => setFormData({ ...formData, prize_amount: e.target.value })}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge-track">Recommended Track</Label>
              <Select
                value={formData.recommended_track}
                onValueChange={(value) => setFormData({ ...formData, recommended_track: value })}
              >
                <SelectTrigger id="challenge-track">
                  <SelectValue placeholder="Select track..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Promptathon">Promptathon</SelectItem>
                  <SelectItem value="Buildathon">Buildathon</SelectItem>
                  <SelectItem value="Vibeathon">Vibeathon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAdd} disabled={!formData.name}>
              Add Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

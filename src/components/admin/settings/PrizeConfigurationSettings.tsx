import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Prize {
  id: string;
  prize_type: string;
  amount: number;
  description: string | null;
}

export function PrizeConfigurationSettings() {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: prizes = [], refetch } = useQuery({
    queryKey: ["prizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select("*")
        .order("amount", { ascending: false });

      if (error) throw error;
      return data as Prize[];
    },
  });

  const [formData, setFormData] = useState({
    prize_type: "",
    amount: "",
    description: "",
  });

  const [editedPrizes, setEditedPrizes] = useState<Record<string, number>>({});

  const handleUpdateAmount = (id: string, amount: number) => {
    setEditedPrizes({ ...editedPrizes, [id]: amount });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [id, amount] of Object.entries(editedPrizes)) {
        const { error } = await supabase
          .from("prizes")
          .update({ amount })
          .eq("id", id);

        if (error) throw error;
      }

      toast({
        title: "Prizes updated",
        description: "Prize amounts have been saved",
      });

      setEditedPrizes({});
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

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from("prizes").insert({
        prize_type: formData.prize_type,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
      });

      if (error) throw error;

      toast({
        title: "Prize added",
        description: "New prize has been created",
      });

      setFormData({ prize_type: "", amount: "", description: "" });
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
      const { error } = await supabase.from("prizes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Prize deleted",
        description: "Prize has been removed",
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
            <CardTitle>Prize Configuration</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Prize
              </Button>
              <Button onClick={handleSave} disabled={saving || Object.keys(editedPrizes).length === 0}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prizes.map((prize) => (
              <div key={prize.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{prize.prize_type}</h4>
                  {prize.description && (
                    <p className="text-sm text-muted-foreground">{prize.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`prize-${prize.id}`} className="sr-only">
                    Amount
                  </Label>
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    id={`prize-${prize.id}`}
                    type="number"
                    value={editedPrizes[prize.id] ?? prize.amount}
                    onChange={(e) => handleUpdateAmount(prize.id, parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(prize.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Prize</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prize-type">Prize Type</Label>
              <Input
                id="prize-type"
                value={formData.prize_type}
                onChange={(e) => setFormData({ ...formData, prize_type: e.target.value })}
                placeholder="Best Newcomer Award"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize-amount">Amount</Label>
              <Input
                id="prize-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize-description">Description (optional)</Label>
              <Input
                id="prize-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Awarded to the best first-time participant"
              />
            </div>

            <Button onClick={handleAdd} disabled={!formData.prize_type || !formData.amount}>
              Add Prize
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

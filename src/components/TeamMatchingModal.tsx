import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamSeeker {
  id: string;
  user_name: string;
  email: string;
  role: string;
  track: string;
  skills_offered: string[];
  skills_needed: string[];
  created_at: string;
}

export const TeamMatchingModal = () => {
  const [seekers, setSeekers] = useState<TeamSeeker[]>([]);
  const [filteredSeekers, setFilteredSeekers] = useState<TeamSeeker[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    role: "",
    track: "promptathon",
    skills_offered: "",
    skills_needed: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchSeekers();

      // Subscribe to real-time changes
      const channel = supabase
        .channel('team-seekers-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'team_seekers'
          },
          () => {
            fetchSeekers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTrack === "all") {
      setFilteredSeekers(seekers);
    } else {
      setFilteredSeekers(seekers.filter(s => s.track === selectedTrack));
    }
  }, [selectedTrack, seekers]);

  const fetchSeekers = async () => {
    const { data, error } = await supabase
      .from('team_seekers')
      .select('*')
      .eq('looking_for_team', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSeekers(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('team_seekers')
      .insert({
        user_name: formData.user_name,
        email: formData.email,
        role: formData.role,
        track: formData.track,
        skills_offered: formData.skills_offered.split(',').map(s => s.trim()).filter(Boolean),
        skills_needed: formData.skills_needed.split(',').map(s => s.trim()).filter(Boolean),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "You're now on the team matching board.",
      });
      setFormData({
        user_name: "",
        email: "",
        role: "",
        track: "promptathon",
        skills_offered: "",
        skills_needed: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          Find Teammates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Matching Board</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="browse">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="post">Post Your Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={selectedTrack === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTrack("all")}
              >
                All Tracks
              </Button>
              <Button
                variant={selectedTrack === "promptathon" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTrack("promptathon")}
              >
                Promptathon
              </Button>
              <Button
                variant={selectedTrack === "buildathon" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTrack("buildathon")}
              >
                Buildathon
              </Button>
              <Button
                variant={selectedTrack === "vibeathon" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTrack("vibeathon")}
              >
                Vibeathon
              </Button>
            </div>

            <div className="space-y-3">
              {filteredSeekers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No one looking for teammates in this track yet. Be the first!
                </p>
              ) : (
                filteredSeekers.map((seeker) => (
                  <div key={seeker.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{seeker.user_name}</h4>
                        <p className="text-sm text-muted-foreground">{seeker.role}</p>
                      </div>
                      <Badge>{seeker.track}</Badge>
                    </div>
                    
                    {seeker.skills_offered.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Skills I bring:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {seeker.skills_offered.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {seeker.skills_needed.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Looking for:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {seeker.skills_needed.map((skill, idx) => (
                            <Badge key={idx} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => window.location.href = `mailto:${seeker.email}?subject=Team up for ${seeker.track}!`}
                    >
                      <Mail className="w-4 h-4" />
                      Connect
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="post">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_name">Your Name</Label>
                  <Input
                    id="user_name"
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., Product Manager, Designer, Developer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="track">Track</Label>
                <select
                  id="track"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                >
                  <option value="promptathon">Promptathon</option>
                  <option value="buildathon">Buildathon</option>
                  <option value="vibeathon">Vibeathon</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills_offered">Skills You Bring (comma-separated)</Label>
                <Input
                  id="skills_offered"
                  placeholder="e.g., UX Design, Python, Data Analysis"
                  value={formData.skills_offered}
                  onChange={(e) => setFormData({ ...formData, skills_offered: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills_needed">Skills You're Looking For (comma-separated)</Label>
                <Input
                  id="skills_needed"
                  placeholder="e.g., Frontend Dev, Marketing, Backend"
                  value={formData.skills_needed}
                  onChange={(e) => setFormData({ ...formData, skills_needed: e.target.value })}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Post to Team Board
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

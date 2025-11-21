import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Box, Zap, Clock, Twitter, Linkedin, Facebook } from "lucide-react";
import confetti from "canvas-confetti";

type FormData = {
  full_name: string;
  email: string;
  company: string;
  role: string;
  track: string;
  challenges: string[];
  team_status: string;
  experience_level: string;
  how_heard: string;
  agreed_to_code_of_conduct: boolean;
};

const challenges = [
  "Customer Onboarding",
  "Internal Tools",
  "Data Visualization",
  "Workflow Automation",
  "Customer Support",
  "Open Innovation",
];

const tracks = [
  {
    value: "promptathon",
    label: "Promptathon",
    description: "For non-technical builders - describe and watch it materialize",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    value: "buildathon",
    label: "Buildathon",
    description: "For PMs & designers - prototype real products",
    icon: Box,
    color: "text-secondary",
  },
  {
    value: "vibeathon",
    label: "Vibeathon",
    description: "For multidisciplinary teams - build, integrate, ship",
    icon: Zap,
    color: "text-accent",
  },
];

export const RegistrationSection = () => {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    company: "",
    role: "",
    track: "",
    challenges: [],
    team_status: "",
    experience_level: "",
    how_heard: "",
    agreed_to_code_of_conduct: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [registrationNumber, setRegistrationNumber] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch initial registration count
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });
      setRegistrationCount(count || 0);
    };
    fetchCount();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("registration-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Check for pre-selected track from About section
  useEffect(() => {
    const selectedTrack = sessionStorage.getItem("selectedTrack");
    if (selectedTrack) {
      setFormData((prev) => ({ ...prev, track: selectedTrack }));
      sessionStorage.removeItem("selectedTrack");
    }
  }, []);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("registrations")
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          company: formData.company || null,
          role: formData.role,
          track: formData.track,
          challenges: formData.challenges,
          team_status: formData.team_status,
          experience_level: formData.experience_level,
          how_heard: formData.how_heard,
          agreed_to_code_of_conduct: formData.agreed_to_code_of_conduct,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Registered",
            description: "This email is already registered for the hackathon.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setRegistrationNumber(data.registration_number);
      fireConfetti();
      toast({
        title: "Registration Successful!",
        description: `You're #${data.registration_number} on the list!`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChallengeToggle = (challenge: string) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter((c) => c !== challenge)
        : [...prev.challenges, challenge],
    }));
  };

  const shareUrl = window.location.href;
  const shareText = `I just registered for Lovable Enterprise Hacks! Join me in building what matters. #LovableHacks`;

  if (registrationNumber !== null) {
    return (
      <section id="register" className="py-24 px-4 bg-background">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">You're In!</h2>
            <p className="text-xl text-muted-foreground mb-8">
              You're #{registrationNumber} on the list!
            </p>
          </div>

          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Share to Unlock Early Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Share your registration and get early access to challenge briefs
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        shareText
                      )}&url=${encodeURIComponent(shareUrl)}`,
                      "_blank"
                    )
                  }
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        shareUrl
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 px-4 bg-background">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Claim Your Spot</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Limited to 150 builders. Registration closes soon.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{registrationCount}/150 spots filled</span>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Company */}
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  required
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Track Selection */}
              <div>
                <Label className="mb-3 block">Track Selection *</Label>
                <RadioGroup
                  required
                  value={formData.track}
                  onValueChange={(value) => setFormData({ ...formData, track: value })}
                >
                  {tracks.map((track) => {
                    const TrackIcon = track.icon;
                    return (
                      <div
                        key={track.value}
                        className="flex items-start space-x-3 p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <RadioGroupItem value={track.value} id={track.value} />
                        <Label
                          htmlFor={track.value}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <TrackIcon className={`w-4 h-4 ${track.color}`} />
                            <span className="font-semibold">{track.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {track.description}
                          </p>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Challenge Interest */}
              <div>
                <Label className="mb-3 block">Challenge Interest (select all that apply) *</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {challenges.map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.challenges.includes(challenge)}
                        onCheckedChange={() => handleChallengeToggle(challenge)}
                      />
                      <Label htmlFor={challenge} className="cursor-pointer">
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Status */}
              <div>
                <Label htmlFor="team_status">Team Status *</Label>
                <Select
                  required
                  value={formData.team_status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, team_status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="have_team">I have a team</SelectItem>
                    <SelectItem value="looking">Looking for teammates</SelectItem>
                    <SelectItem value="solo">Solo builder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <Label htmlFor="experience_level">Experience Level *</Label>
                <Select
                  required
                  value={formData.experience_level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, experience_level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First hackathon</SelectItem>
                    <SelectItem value="1-3">1-3 hackathons</SelectItem>
                    <SelectItem value="4+">4+ hackathons</SelectItem>
                    <SelectItem value="organized">I've organized hackathons</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* How did you hear */}
              <div>
                <Label htmlFor="how_heard">How did you hear about us? *</Label>
                <Select
                  required
                  value={formData.how_heard}
                  onValueChange={(value) =>
                    setFormData({ ...formData, how_heard: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Colleague</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="website">Lovable Website</SelectItem>
                    <SelectItem value="community">Community/Discord</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Code of Conduct */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="code_of_conduct"
                  required
                  checked={formData.agreed_to_code_of_conduct}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      agreed_to_code_of_conduct: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="code_of_conduct" className="cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Code of Conduct
                  </a>{" "}
                  *
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  isSubmitting || formData.challenges.length === 0
                }
              >
                {isSubmitting ? "Registering..." : "Register Now - It's Free"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

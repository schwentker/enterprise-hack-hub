import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, BarChart3, Workflow, Headphones, Lightbulb } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  icon: React.ReactNode;
  problem: string;
  criteria: string[];
  prize: string;
  recommendedTrack: string;
  trackColor: string;
}

const challenges: Challenge[] = [
  {
    id: "onboarding",
    title: "Customer Onboarding",
    icon: <Users className="w-6 h-6" />,
    problem: "Enterprise customers take 45+ days to fully onboard. Build a self-service experience that reduces time-to-value by 50%.",
    criteria: [
      "Interactive progress tracker",
      "Smart defaults based on company size",
      "Integration checklist with real-time status"
    ],
    prize: "$10,000",
    recommendedTrack: "Buildathon",
    trackColor: "hsl(var(--secondary))"
  },
  {
    id: "internal-tools",
    title: "Internal Tools",
    icon: <Building2 className="w-6 h-6" />,
    problem: "Teams are drowning in spreadsheets and email chains. Create an internal tool that eliminates manual data entry and automates repetitive workflows.",
    criteria: [
      "Connect to at least 2 data sources",
      "Automated task assignment and tracking",
      "Role-based access controls"
    ],
    prize: "$8,000",
    recommendedTrack: "Promptathon",
    trackColor: "hsl(var(--primary))"
  },
  {
    id: "data-viz",
    title: "Data Visualization",
    icon: <BarChart3 className="w-6 h-6" />,
    problem: "Executive teams need real-time insights but current dashboards are static and outdated. Build an intelligent analytics platform that tells the story behind the numbers.",
    criteria: [
      "Natural language query interface",
      "Automated anomaly detection",
      "Shareable, interactive reports"
    ],
    prize: "$12,000",
    recommendedTrack: "Vibeathon",
    trackColor: "hsl(var(--accent))"
  },
  {
    id: "workflow",
    title: "Workflow Automation",
    icon: <Workflow className="w-6 h-6" />,
    problem: "Critical business processes require manual handoffs between 5+ teams. Design an automation system that orchestrates complex workflows with minimal human intervention.",
    criteria: [
      "Visual workflow builder",
      "Multi-system integration capability",
      "Error handling and rollback mechanisms"
    ],
    prize: "$9,000",
    recommendedTrack: "Buildathon",
    trackColor: "hsl(var(--secondary))"
  },
  {
    id: "support",
    title: "Customer Support",
    icon: <Headphones className="w-6 h-6" />,
    problem: "Support tickets take 48+ hours to resolve due to manual triage and routing. Build an AI-powered system that categorizes, prioritizes, and auto-resolves common issues.",
    criteria: [
      "Intelligent ticket categorization",
      "Suggested responses based on history",
      "Escalation detection and routing"
    ],
    prize: "$11,000",
    recommendedTrack: "Promptathon",
    trackColor: "hsl(var(--primary))"
  },
  {
    id: "open",
    title: "Open Innovation",
    icon: <Lightbulb className="w-6 h-6" />,
    problem: "Your choice! Identify an enterprise pain point and build a solution that could scale to thousands of users. Judges will evaluate market potential and technical execution.",
    criteria: [
      "Clear problem-solution fit",
      "Scalable architecture",
      "Compelling business case"
    ],
    prize: "$15,000",
    recommendedTrack: "Vibeathon",
    trackColor: "hsl(var(--accent))"
  }
];

export const ChallengeTracksSection = () => {
  return (
    <section id="challenges" className="py-24 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Six Enterprise Challenges
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real problems from real companies. Build solutions that could ship Monday morning.
          </p>
        </div>

        <Tabs defaultValue="onboarding" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2">
            {challenges.map((challenge) => (
              <TabsTrigger
                key={challenge.id}
                value={challenge.id}
                className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-accent/10 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {challenge.icon}
                </div>
                <span className="text-xs md:text-sm font-medium">{challenge.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {challenges.map((challenge) => (
            <TabsContent
              key={challenge.id}
              value={challenge.id}
              className="mt-0 animate-fade-in"
            >
              <div className="bg-card border border-border rounded-lg p-8 shadow-lg backdrop-blur-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${challenge.trackColor}15` }}
                    >
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{challenge.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Recommended: {challenge.recommendedTrack}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Prize Pool</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {challenge.prize}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    THE CHALLENGE
                  </h4>
                  <p className="text-lg leading-relaxed">{challenge.problem}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    SUCCESS CRITERIA
                  </h4>
                  <ul className="space-y-2">
                    {challenge.criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2"
                          style={{ backgroundColor: challenge.trackColor }}
                        />
                        <span className="text-base">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>Sponsor logo placeholder</span>
                  </div>
                  <button className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Register for This Track
                  </button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

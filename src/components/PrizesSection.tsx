import { Trophy, Award, Star, Zap, Heart, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Prize = {
  title: string;
  amount: string;
  icon: typeof Trophy;
  benefits: string[];
  color: string;
  bgColor: string;
  borderColor: string;
};

const grandPrize: Prize = {
  title: "Grand Prize",
  amount: "$15,000",
  icon: Trophy,
  benefits: [
    "Cash prize",
    "Fast-track to Lovable Enterprise Partner program",
    "Featured case study on Lovable blog",
    "1 year Lovable Scale subscription",
  ],
  color: "text-primary",
  bgColor: "bg-primary/5",
  borderColor: "border-primary",
};

const trackWinners: Prize[] = [
  {
    title: "Promptathon Winner",
    amount: "$10,000",
    icon: Award,
    benefits: [
      "Cash prize",
      "6 months Lovable Scale subscription",
      "Demo slot at Lovable community showcase",
    ],
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/30",
  },
  {
    title: "Buildathon Winner",
    amount: "$10,000",
    icon: Award,
    benefits: [
      "Cash prize",
      "6 months Lovable Scale subscription",
      "Demo slot at Lovable community showcase",
    ],
    color: "text-secondary",
    bgColor: "bg-secondary/5",
    borderColor: "border-secondary/30",
  },
  {
    title: "Vibeathon Winner",
    amount: "$10,000",
    icon: Award,
    benefits: [
      "Cash prize",
      "6 months Lovable Scale subscription",
      "Demo slot at Lovable community showcase",
    ],
    color: "text-accent",
    bgColor: "bg-accent/5",
    borderColor: "border-accent/30",
  },
];

const challengeWinners: Prize[] = [
  {
    title: "Challenge Winner",
    amount: "$5,000 each",
    icon: Star,
    benefits: ["Cash prize", "Lovable swag pack"],
    color: "text-foreground",
    bgColor: "bg-card",
    borderColor: "border-border",
  },
];

const specialAwards: Prize[] = [
  {
    title: "Most Likely to Ship Monday",
    amount: "$2,500",
    icon: Rocket,
    benefits: ["Cash prize"],
    color: "text-foreground",
    bgColor: "bg-card",
    borderColor: "border-border",
  },
  {
    title: "Best First-Time Builder",
    amount: "$2,500",
    icon: Heart,
    benefits: ["Cash prize"],
    color: "text-foreground",
    bgColor: "bg-card",
    borderColor: "border-border",
  },
  {
    title: "Community Choice",
    amount: "$2,500",
    icon: Zap,
    benefits: ["Cash prize"],
    color: "text-foreground",
    bgColor: "bg-card",
    borderColor: "border-border",
  },
];

const PrizeCard = ({ prize, featured = false }: { prize: Prize; featured?: boolean }) => {
  const PrizeIcon = prize.icon;
  
  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        featured ? "md:col-span-2 lg:col-span-3" : ""
      } ${prize.borderColor} border-2`}
    >
      <div className={`absolute inset-0 ${prize.bgColor}`} />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`text-2xl mb-2 ${featured ? "md:text-3xl" : ""}`}>
              {prize.title}
            </CardTitle>
            <div className={`text-4xl font-bold ${prize.color} ${featured ? "md:text-5xl" : ""}`}>
              {prize.amount}
            </div>
          </div>
          <div
            className={`p-3 rounded-full ${prize.bgColor} border ${prize.borderColor} ${
              featured ? "md:p-4" : ""
            }`}
          >
            <PrizeIcon className={`w-6 h-6 ${prize.color} ${featured ? "md:w-8 md:h-8" : ""}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-2">
          {prize.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${prize.color} mt-2`} />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const PrizesSection = () => {
  return (
    <section id="prizes" className="py-24 px-4 bg-card">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What You'll Win</h2>
          <p className="text-xl text-muted-foreground">$50,000+ in prizes and opportunities</p>
        </div>

        {/* Grand Prize - Featured */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">
              🏆 Grand Prize
            </Badge>
          </div>
          <div className="grid gap-6">
            <PrizeCard prize={grandPrize} featured />
          </div>
        </div>

        {/* Track Winners */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">Track Winners</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {trackWinners.map((prize, index) => (
              <PrizeCard key={index} prize={prize} />
            ))}
          </div>
        </div>

        {/* Challenge Winners */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">Challenge Winners</h3>
          <p className="text-center text-muted-foreground mb-6">
            Best in each of the 6 challenge categories
          </p>
          <div className="grid gap-6 max-w-md mx-auto">
            {challengeWinners.map((prize, index) => (
              <PrizeCard key={index} prize={prize} />
            ))}
          </div>
        </div>

        {/* Special Awards */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">Special Awards</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {specialAwards.map((prize, index) => (
              <PrizeCard key={index} prize={prize} />
            ))}
          </div>
        </div>

        {/* Sponsors */}
        <div className="mt-16 pt-12 border-t border-border">
          <p className="text-center text-muted-foreground mb-8">Prizes provided by</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[1, 2, 3, 4].map((sponsor) => (
              <div
                key={sponsor}
                className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm"
              >
                Logo {sponsor}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

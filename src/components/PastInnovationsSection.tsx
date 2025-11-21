import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

type CaseStudy = {
  title: string;
  metric: string;
  quote: string;
  outcome: string;
  organizer?: string;
  color: string;
};

const caseStudies: CaseStudy[] = [
  {
    title: "NHS Clinical AI",
    metric: "300+ healthcare professionals activated",
    quote: "For the first time, I can build apps without the headache",
    outcome: "Now used across UK NHS locations",
    color: "from-primary to-secondary",
  },
  {
    title: "AmEx Smart Offers",
    metric: "100+ developers, 25 hacks in 24 hours",
    quote: "That hack was truly a work of art",
    outcome: "Presented to CEO Ken Chenault next day",
    organizer: "Organized by Robert Schwentker",
    color: "from-secondary to-accent",
  },
  {
    title: "Blockchain University Demo Night",
    metric: "60+ projects incubated, 5 became VC-funded startups",
    quote: "The launchpad for groundbreaking blockchain projects",
    outcome: "350+ alumni across Silicon Valley, Tokyo, India",
    organizer: "Organized by Robert Schwentker",
    color: "from-accent to-primary",
  },
  {
    title: "PayPal BattleHack",
    metric: "12 hackathons, thousands of developers",
    quote: "Where startups meet enterprise infrastructure",
    outcome: "300+ startups to commercialization",
    organizer: "Organized by Robert Schwentker",
    color: "from-primary to-accent",
  },
];

const CaseStudyCard = ({ study }: { study: CaseStudy }) => {
  return (
    <Card className="h-full border-2 border-border hover:border-primary/30 transition-all">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Image Placeholder */}
        <div
          className={`w-full h-48 rounded-lg bg-gradient-to-br ${study.color} mb-6 flex items-center justify-center`}
        >
          <div className="text-white/80 text-center px-4">
            <p className="text-sm font-medium">Case Study Image</p>
            <p className="text-xs mt-1">{study.title}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-4">{study.title}</h3>

        {/* Metric */}
        <p className="text-lg text-muted-foreground mb-4">{study.metric}</p>

        {/* Quote */}
        <div className="flex-1 mb-4">
          <div className="flex gap-2 mb-2">
            <Quote className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-foreground italic">{study.quote}</p>
          </div>
        </div>

        {/* Outcome */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-semibold text-primary mb-2">Outcome:</p>
          <p className="text-muted-foreground">{study.outcome}</p>
        </div>

        {/* Organizer Credit */}
        {study.organizer && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground italic">{study.organizer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PastInnovationsSection = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From Hackathon to Production
          </h2>
          <p className="text-xl text-muted-foreground">See what builders have shipped</p>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 mb-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={index} study={study} />
          ))}
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {caseStudies.map((study, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2">
                  <CaseStudyCard study={study} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            Join the next generation of builders turning weekend projects into production systems
          </p>
        </div>
      </div>
    </section>
  );
};

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Do I need to know how to code?",
      answer:
        "Not for Promptathon track! If you can describe what you want clearly, Lovable can build it. Buildathon welcomes non-technical PMs with optional dev teammates. Vibeathon is for experienced builders.",
    },
    {
      question: "Can I participate remotely?",
      answer:
        "Yes! The hackathon is fully remote-friendly with live streams, virtual mentor sessions, and async collaboration tools.",
    },
    {
      question: "What if I don't have a team?",
      answer:
        "No problem. We'll host a team matching session in Phase 1. Many winning teams form at hackathons!",
    },
    {
      question: "Do I keep what I build?",
      answer:
        "Absolutely. You own 100% of your code and can continue building after the hackathon. Winners get featured but everyone keeps their work.",
    },
    {
      question: "What's the judging criteria?",
      answer:
        "Innovation (25%), Product Quality/UX (25%), Business Impact (25%), Lovable Platform Usage (25%)",
    },
    {
      question: "I've never used Lovable before. Is that okay?",
      answer:
        "Perfect! We'll have onboarding sessions and mentors available. Many past winners were first-time Lovable users.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 bg-muted/30">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground">
          Questions? We've Got Answers.
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border border-border rounded-lg px-6 data-[state=open]:shadow-lg transition-shadow"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

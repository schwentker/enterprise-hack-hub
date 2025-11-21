import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Twitter, Linkedin, Github } from "lucide-react";

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { label: "About", id: "about" },
    { label: "Challenges", id: "challenges" },
    { label: "Schedule", id: "schedule" },
    { label: "Prizes", id: "prizes" },
    { label: "Register", id: "register" },
    { label: "FAQ", id: "faq" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Code of Conduct", href: "#" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      {/* Pre-Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Build Something Lovable?
          </h2>
          <Button
            size="lg"
            className="text-lg px-8 py-6 mb-4"
            onClick={() => scrollToSection("register")}
          >
            Register Now
          </Button>
          <p className="text-muted-foreground">
            Or contact us:{" "}
            <a
              href="mailto:hacks@sandboxlabs.ai"
              className="text-primary hover:underline"
            >
              hacks@sandboxlabs.ai
            </a>
          </p>
        </div>
      </section>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Tagline */}
          <div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Lovable Hackathon
            </h3>
            <p className="text-sm text-muted-foreground">
              Enterprise Hackathons by Sandbox Labs AI
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social and Legal Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Connect
            </h4>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Credibility Strip */}
        <div className="mb-8 text-center">
          <p className="font-semibold mb-2 text-foreground">
            Produced by Robert Schwentker
          </p>
          <p className="text-sm text-muted-foreground mb-1">
            50+ hackathons organized | 300+ startups mentored | 140K+ learners
          </p>
          <p className="text-sm text-muted-foreground">
            Previously: PayPal, American Express, MIT Media Lab, UN Women
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Powered By and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span>Built on Lovable</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" />
              </svg>
            </a>
            <span className="hidden md:inline">|</span>
            <span className="text-xs">
              Built in 4 hours to demonstrate enterprise hackathon activation
            </span>
          </div>
          <div>© 2025 Sandbox Labs AI</div>
        </div>
      </div>
    </footer>
  );
};

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Header1 from '@/components/mvpblocks/header-1';
import FooterGlow from "@/components/mvpblocks/footer-glow";

// Lucide Icons
import {
  CheckCircle,
  Users,
  Bot,
  LifeBuoy,
  Layers,
  Settings,
  Zap,
  Mail,
  CheckIcon
} from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    features: [
      { text: "Unlimited Projects", icon: Layers },
      { text: "Basic Support", icon: LifeBuoy },
      { text: "5 AI messages/day", icon: Bot },
      { text: "Limited Team Support", icon: Users },
    ],
    cta: "Get Started",
    link: "/signup",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    features: [
      { text: "Unlimited Projects", icon: Layers },
      { text: "Dedicated Support", icon: LifeBuoy },
      { text: "Unlimited AI messages", icon: Bot },
      { text: "Custom Integrations", icon: Settings },
      { text: "Advanced Team Features", icon: Users },
    ],
    cta: "Contact Sales",
    link: "mailto:eracruxofficial@gmail.com",
  },
];

export default function PricingPage() {
  return (
    <div style={{ background: "linear-gradient(135deg, #0a0613 0%, #150d27 100%)" }}>
        <main
          className="min-h-screen bg-muted py-16 px-4 font-inter"
          style={{ background: "linear-gradient(135deg, #0a0613 0%, #150d27 100%)" }}
        >
          <Header1 />
          <h1
            className="text-4xl font-bold text-center mb-12 mt-12 text-foreground font-poppins tracking-tight"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Your Data. Your Way.
            <br />
            Visualized.
          </h1>
          <p
            className=" text-center mb-12 mt-12 text-foreground font-poppins tracking-tight max-w-2xl mx-auto"
            style={{ fontFamily: "Poppins, Inter, sans-serif" }}
          >
            Most tools stop at reports. EraCrux drives action. Get ready-to-deploy
            campaigns, SEO-rich content, and proven optimization strategies—far
            beyond charts and dashboards.
          </p>
          
          <div className="max-w-3xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 mb-32">
            {pricingPlans.map((plan, idx) => (
              <Card
                key={plan.name}
                className={`flex flex-col justify-between border shadow-lg transition-all hover:scale-[1.03] ${
                  idx === 1
                    ? "border-primary bg-primary/5 shadow-primary/20"
                    : "bg-background"
                }`}
                style={{
                  fontFamily: "Inter, Poppins, sans-serif",
                }}
              >
                <CardHeader className="text-center">
                  <CardTitle
                    className={`text-2xl font-semibold mb-1 ${
                      idx === 1 ? "text-primary" : ""
                    }`}
                    style={{ fontFamily: "Poppins, Inter, sans-serif" }}
                  >
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => {
                      const Icon = feature.icon || CheckCircle;
                      return (
                        <li
                          key={feature.text}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <Icon className="w-5 h-5 text-primary" />
                          <span>{feature.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <a href={plan.link} className="w-full ">
                    <Button
                      className={`w-full cursor-pointer font-poppins ${
                        idx === 1
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
          <FooterGlow />
    </div>
  );
}

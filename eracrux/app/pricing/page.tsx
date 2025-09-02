import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { link } from "fs";

const pricingPlans = [
    {
        name: "Free",
        price: "$0",
        features: [
            "Unlimited Projects",
            "Basic Support",
            "5 AI messages/day",
            "Limited Team Support",

        ],
        cta: "Get Started",
        link: "/signup"
    },
    {
        name: "Enterprise",
        price: "Contact Us",
        features: [
            "Unlimited Projects",
            "Dedicated Support",
            "Custom Integrations",
            "Advanced Team Features",
            "Unlimited AI messages",
        ],
        cta: "Contact Sales",
        link: "mailto:eracruxofficial@gmail.com"
    },
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-muted py-16 px-4 font-inter">
            <h1
                className="text-4xl font-bold text-center mb-12 text-foreground font-poppins tracking-tight"
                style={{ fontFamily: "Poppins, Inter, sans-serif" }}
            >
                Pricing Plans
            </h1>
            <div className="max-w-3xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2">
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
                            <div className="text-4xl font-bold mb-2">
                                {plan.price}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="mb-6 space-y-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-center gap-2 text-muted-foreground"
                                    >
                                        <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
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
    );
}

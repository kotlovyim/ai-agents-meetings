"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckIcon,
    SparklesIcon,
    ZapIcon,
    CrownIcon,
    ShieldCheckIcon,
} from "lucide-react";
import { UpgradeHeader } from "../components/upgrade-header";

const pricingPlans = [
    {
        id: "free",
        name: "Free",
        description: "Perfect for trying out AI agents",
        price: "$0",
        period: "forever",
        features: [
            { text: "3 AI agents", included: true },
            { text: "5 meetings per month", included: true },
            { text: "30 minutes per meeting", included: true },
            { text: "Basic transcription", included: true },
            { text: "Email support", included: true },
            { text: "Advanced analytics", included: false },
            { text: "Custom branding", included: false },
            { text: "Priority support", included: false },
        ],
        icon: SparklesIcon,
        popular: false,
        currentPlan: true,
    },
    {
        id: "pro",
        name: "Pro",
        description: "For professionals and small teams",
        price: "$29",
        period: "per month",
        features: [
            { text: "Unlimited AI agents", included: true },
            { text: "Unlimited meetings", included: true },
            { text: "Unlimited duration", included: true },
            { text: "Advanced transcription", included: true },
            { text: "Priority email support", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Custom branding", included: true },
            { text: "API access", included: true },
        ],
        icon: ZapIcon,
        popular: true,
        currentPlan: false,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "For large organizations with custom needs",
        price: "Custom",
        period: "contact us",
        features: [
            { text: "Everything in Pro", included: true },
            { text: "Dedicated account manager", included: true },
            { text: "Custom integrations", included: true },
            { text: "SLA guarantee", included: true },
            { text: "On-premise deployment", included: true },
            { text: "Advanced security", included: true },
            { text: "Custom contracts", included: true },
            { text: "24/7 phone support", included: true },
        ],
        icon: CrownIcon,
        popular: false,
        currentPlan: false,
    },
];

export function UpgradeView() {
    return (
        <>
            <UpgradeHeader />
            <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4 overflow-y-auto">
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col ${
                                    plan.popular
                                        ? "border-primary shadow-md"
                                        : ""
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                        <Badge className="px-2 py-0.5 text-xs">
                                            <SparklesIcon className="size-3 mr-1" />
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                {plan.currentPlan && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                        <Badge
                                            variant="secondary"
                                            className="px-2 py-0.5 text-xs"
                                        >
                                            <ShieldCheckIcon className="size-3 mr-1" />
                                            Current Plan
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-4 pt-6">
                                    <div className="mx-auto mb-3 p-2 bg-primary/10 rounded-full w-fit">
                                        <Icon className="size-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm mt-1">
                                        {plan.description}
                                    </CardDescription>
                                    <div className="mt-4">
                                        <span className="text-3xl font-bold">
                                            {plan.price}
                                        </span>
                                        {plan.price !== "Custom" && (
                                            <span className="text-sm text-muted-foreground ml-1">
                                                / {plan.period}
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col pt-0">
                                    <ul className="space-y-2 mb-4 flex-1">
                                        {plan.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2"
                                            >
                                                <CheckIcon
                                                    className={`size-4 mt-0.5 shrink-0 ${
                                                        feature.included
                                                            ? "text-primary"
                                                            : "text-muted-foreground/30"
                                                    }`}
                                                />
                                                <span
                                                    className={`text-sm ${
                                                        feature.included
                                                            ? ""
                                                            : "text-muted-foreground/50 line-through"
                                                    }`}
                                                >
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        size="sm"
                                        variant={
                                            plan.popular ? "default" : "outline"
                                        }
                                        className="w-full"
                                        disabled={plan.currentPlan}
                                    >
                                        {plan.currentPlan
                                            ? "Current Plan"
                                            : plan.id === "enterprise"
                                              ? "Contact Sales"
                                              : "Upgrade Now"}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

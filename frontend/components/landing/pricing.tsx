'use client'

import { Button } from "@/components/landing/ui/button_pricing"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    interval: "/month",
    features: [
      { name: "1 AI Agent", included: true },
      { name: "100 queries/month", included: true },
      { name: "Priority support", included: false },
      { name: "24/7 support", included: false },
      { name: "Custom AI training", included: false },
      { name: "Dedicated account manager", included: false },
      { name: "Custom integrations", included: false },
    ],
    buttonText: "Get Started",
  },
  {
    name: "Standard",
    description: "For growing projects",
    price: "$29",
    interval: "/month",
    features: [
      { name: "3 AI Agents", included: true },
      { name: "1,000 queries/month", included: true },
      { name: "Priority support", included: true },
      { name: "24/7 support", included: false },
      { name: "Custom AI training", included: false },
      { name: "Dedicated account manager", included: false },
      { name: "Custom integrations", included: false },
    ],
    buttonText: "Subscribe",
  },
  {
    name: "Professional",
    description: "For serious AI enthusiasts",
    price: "$99",
    interval: "/month",
    features: [
      { name: "10 AI Agents", included: true },
      { name: "Unlimited queries", included: true },
      { name: "Priority support", included: true },
      { name: "24/7 support", included: true },
      { name: "Custom AI training", included: true },
      { name: "Dedicated account manager", included: false },
      { name: "Custom integrations", included: false },
    ],
    buttonText: "Subscribe",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale AI operations",
    price: "Custom",
    interval: "",
    features: [
      { name: "Unlimited AI Agents", included: true },
      { name: "Unlimited queries", included: true },
      { name: "Priority support", included: true },
      { name: "24/7 support", included: true },
      { name: "Custom AI training", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom integrations", included: true },
    ],
    buttonText: "Contact Sales",
  },
]

export function Pricing() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg ${
                plan.highlighted ? "border-2 border-blue-500" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-4 text-gray-400">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-white">
                {plan.price}
                <span className="text-xl font-normal">{plan.interval}</span>
              </p>
              <ul className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-gray-500 mr-2" />
                    )}
                    <span
                      className={
                        feature.included ? "text-gray-300" : "text-gray-500"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
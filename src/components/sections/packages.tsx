"use client";

import { Check } from "lucide-react";

const packages = [
  {
    id: "01",
    title: "Essential Fleet Care",
    subtitle:
      "For agencies that want control and visibility without overcomplicating things.",
    priceLabel: "PER VEHICLE / PER MONTH",
    popular: false,
    features: [
      {
        group: "INCLUDED SERVICES",
        items: [
          "Vehicle lifecycle oversight (buy, run, upgrade, sell)",
          "Registration management & reminders",
          "Servicing coordination (preferred providers)",
          "Roadside assistance (24/7)",
          "Tyre monitoring & replacement coordination",
          "Cleaning coordination (basic wash schedule)",
          "Admin support for vehicle-related queries",
          "Centralised invoicing",
          "Business-use vs private KM tracking",
          "Mobile logbook (ATO-compliant)",
        ],
      },
      {
        group: "APP ACCESS",
        items: [
          "Fleet dashboard",
          "Vehicle status overview",
          "Cost tracking",
          "Alerts & reminders",
        ],
      },
    ],
  },
  {
    id: "02",
    title: "Optimised Fleet",
    subtitle:
      "For agencies that want cost control, uptime, and smarter decisions.",
    priceLabel: "PER VEHICLE / PER MONTH",
    popular: true,
    features: [
      {
        group: "Everything in Essential Fleet Care, plus:",
        items: [],
      },
      {
        group: "OPTIMISATION & INTELLIGENCE",
        items: [
          "Cost-to-keep vs cost-to-replace analysis",
          "Upgrade timing recommendations",
          "Resale value tracking",
          "Lifecycle cost reporting per vehicle",
          "Agency-wide cost benchmarking",
        ],
      },
      {
        group: "SERVICE ENHANCEMENTS",
        items: [
          "Priority servicing scheduling",
          "Mobile mechanic servicing (where applicable)",
          "Onsite servicing coordination",
          "Loan vehicle coordination during downtime",
          "Tyre replacement strategy (not reactive)",
        ],
      },
      {
        group: "FUEL & USAGE",
        items: [
          "Fuel spend tracking",
          "KM efficiency reporting",
          "Private vs business KM split automation",
          "Fringe benefits / allowance reporting support",
        ],
      },
      {
        group: "PAYMENTS & REWARDS",
        items: [
          "Aggregated novated lease payments",
          "Amex-enabled payments for fleet costs",
          "Points earned on fleet spend (surcharge applies)",
        ],
      },
      {
        group: "APP ACCESS",
        items: [
          "Cost trend dashboards",
          "Vehicle performance alerts",
          "Upgrade window notifications",
        ],
      },
    ],
  },
  {
    id: "03",
    title: "Agency Fleet Partner",
    subtitle:
      "For principals who want everything handled, optimised, and invisible.",
    priceLabel: "PER AGENCY + PER VEHICLE",
    popular: false,
    features: [
      {
        group: "Everything in Optimised Fleet, plus:",
        items: [],
      },
      {
        group: "FULL WHITE-GLOVE MANAGEMENT",
        items: [
          "Vehicle sourcing & replacement planning",
          "Finance coordination (novated lease / allowance alignment)",
          "End-of-life vehicle disposal (lease / allowance management)",
          "Branding & decal coordination",
          "Fleet standardisation (approved vehicle lists)",
          "New agent onboarding vehicle support",
        ],
      },
      {
        group: "APP ACCESS",
        items: [
          "Principal dashboard",
          "Multi-office visibility",
          "Vehicle and agency-level insights",
          "AI-driven recommendations",
          "Compliance & reporting centre",
        ],
      },
    ],
  },
];

export default function PackagesSection() {
  return (
    <section
      id="packages"
      className="py-16 md:py-24 bg-[#f8f5f1] text-gray-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-orange-600 uppercase tracking-wider font-medium mb-4">
            ─ PACKAGES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Choose Your Level of{" "}
            <span className="text-orange-600">Partnership</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Every package includes direct debit and credit card payment options,
            including Amex.
            <br className="hidden sm:block" />
            Scale up as your fleet grows.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl ${
                pkg.popular ? "lg:scale-105 lg:z-10 border-orange-500/40" : ""
              }`}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-0 left-0 flex justify-center">
                  <span className="bg-orange-600 text-white text-xs font-bold uppercase px-6 py-1.5 rounded-b-lg shadow-md">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="p-8 pt-12 md:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {pkg.id}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {pkg.title}
                  </h3>
                  <p className="text-gray-600 mt-3 text-sm md:text-base">
                    {pkg.subtitle}
                  </p>
                  <p className="mt-4 text-orange-600 font-semibold tracking-wide">
                    {pkg.priceLabel}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-8">
                  {pkg.features.map((group, idx) => (
                    <div key={idx}>
                      {group.group && (
                        <h4 className="text-sm uppercase font-semibold text-gray-500 mb-4 tracking-wider">
                          {group.group}
                        </h4>
                      )}
                      <ul className="space-y-3">
                        {group.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm md:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-10">
                  <button
                    className={`w-full py-4 px-8 rounded-lg font-medium transition ${
                      pkg.popular
                        ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                    }`}
                  >
                    {pkg.popular ? "GET STARTED" : "GET STARTED"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

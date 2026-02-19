"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [expanded, setExpanded] = useState<string | null>("02"); // Default expanded middle one for demo?

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <section
      id="packages"
      className="py-20 md:py-32 bg-[#F9F6F2] text-gray-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C46A0A]" />
            <p className="text-[#C46A0A] uppercase tracking-[0.25em] text-[11px] font-bold">
              PACKAGES
            </p>
          </div>
          <h2 className="text-5xl md:text-[64px] font-serif font-bold leading-[1.1] text-[#1A1A1A] mb-8">
            Choose Your Level of{" "}
            <span className="text-[#C46A0A] italic font-serif">
              Partnership
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl leading-relaxed font-light">
            Every package includes direct debit and credit card payment options,
            including Amex.
            <br className="hidden sm:block" />
            Scale up as your fleet grows.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white p-8 md:p-10 flex flex-col h-full transition-all duration-300 ${pkg.popular
                ? "border-2 border-[#C46A0A] shadow-xl z-10 lg:-mt-4 lg:-mb-4"
                : "border border-gray-100/50 hover:border-gray-200"
                }`}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className="absolute -top-[15px] left-0 right-0 flex justify-center">
                  <span className="bg-[#C46A0A] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 shadow-sm">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[64px] leading-none font-serif font-bold text-[#E5E5E5]">
                    {pkg.id}
                  </span>
                  <span className="bg-[#F9F9F9] text-gray-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mt-2">
                    {pkg.priceLabel}
                  </span>
                </div>

                <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-4 leading-tight">
                  {pkg.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light min-h-[40px]">
                  {pkg.subtitle}
                </p>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-100 w-full mb-8" />

              {/* Features */}
              <div className="flex-grow space-y-8 mb-10">
                {pkg.features.map((group, idx) => {
                  const isAppAccess = group.group === "APP ACCESS";
                  const isEverythingIn = group.group.startsWith("Everything in");

                  return (
                    <div key={idx}>
                      {group.group && (
                        <h4
                          className={`mb-4 ${isEverythingIn
                            ? "text-lg italic font-serif text-[#C46A0A] normal-case"
                            : isAppAccess
                              ? "text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-3"
                              : "text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]"
                            }`}
                        >
                          {group.group}
                        </h4>
                      )}

                      {/* Render Items */}
                      {isAppAccess ? (
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item, i) => (
                            <span
                              key={i}
                              className="bg-[#F5F5F5] text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <ul className="space-y-3">
                          {group.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className="h-3.5 w-3.5 text-[#1A1A1A] flex-shrink-0 mt-[5px]" strokeWidth={3} />
                              <span className="text-[13px] text-gray-600 font-light leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}

                {/* Show All Features Toggle (Visual) */}
                {pkg.features.length > 3 && !pkg.popular && (
                  <button
                    onClick={() => toggleExpand(pkg.id)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#C46A0A] hover:text-[#a85908] transition mt-4"
                  >
                    {expanded === pkg.id ? "SHOW LESS" : "SHOW ALL FEATURES"}
                    {expanded === pkg.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                )}
                {pkg.popular && (
                  <button
                    onClick={() => toggleExpand(pkg.id)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#C46A0A] hover:text-[#a85908] transition mt-4"
                  >
                    {expanded === pkg.id ? "SHOW LESS" : "SHOW ALL FEATURES"}
                    {expanded === pkg.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Button */}
              <div className="mt-auto">
                <button
                  className={`w-full py-4 px-6 text-[11px] font-bold uppercase tracking-[0.15em] transition border ${pkg.popular
                    ? "bg-[#C46A0A] border-[#C46A0A] text-white hover:bg-[#a85908]"
                    : "bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-gray-50"
                    }`}
                >
                  GET STARTED
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


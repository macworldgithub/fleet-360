import type { FC } from "react";

const benefits = [
  {
    number: "01",
    title: "Reduces Admin",
    description:
      "Principals and agents spend less time on vehicle paperwork, servicing calls, and supplier coordination.",
  },
  {
    number: "02",
    title: "Brand Consistency",
    description:
      "Standardised vehicles, coordinated branding, and regular cleaning keep your agency looking professional.",
  },
  {
    number: "03",
    title: "Minimises Downtime",
    description:
      "Proactive servicing, loan vehicles, and emergency response mean your agents are always on the road.",
  },
  {
    number: "04",
    title: "Optimised Spend",
    description:
      "Turn fleet costs into smart, data-driven investments with lifecycle analysis and cost benchmarking.",
  },
  {
    number: "05",
    title: "Earn Rewards",
    description:
      "Amex-enabled payments let you earn points on unavoidable fleet expenses — turning costs into value.",
  },
  {
    number: "06",
    title: "One Partner",
    description:
      "Replace 5-6 separate suppliers with a single fleet partner who understands real estate.",
  },
];

const WhyAgencyGarage: FC = () => {
  return (
    <section id="why-us" className="bg-[#F9F6F2] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left column: header + description + image */}
          <div className="w-full lg:w-5/12 space-y-12">
            {/* Header & subtext */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <span className="w-12 h-[1px] bg-[#C46A0A]" />
                <p className="text-[#C46A0A] uppercase tracking-[0.2em] text-[11px] font-bold">
                  WHY AGENCY GARAGE
                </p>
              </div>
              <h2 className="text-5xl md:text-[52px] font-serif font-bold text-[#1A1A1A] leading-[1.1]">
                Built for the Way{" "}
                <span className="text-[#C46A0A] italic font-serif">
                  You Work
                </span>
              </h2>
              <p className="mt-8 text-base text-gray-500 leading-relaxed font-light">
                Real estate agencies have unique fleet demands — high visibility
                vehicles, tight schedules, and brand reputation on the line
                every day. We built Agency Garage specifically for this reality.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              {/* Top Left Corner Accent */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[#C46A0A]/50 hidden lg:block" />
              <img
                src="/images/agency.jpg"
                alt="Aerial view of Agency Garage fleet"
                className="w-full h-auto object-cover shadow-xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right column: numbered list */}
          <div className="w-full lg:w-7/12">
            <div className="divide-y divide-gray-200/60">
              {benefits.map((benefit) => (
                <div
                  key={benefit.number}
                  className="py-10 first:pt-0 last:pb-0 flex items-start gap-12"
                >
                  <div className="flex-shrink-0">
                    <span className="text-3xl font-serif font-bold text-[#e8dac9]">
                      {benefit.number}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-light">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAgencyGarage;

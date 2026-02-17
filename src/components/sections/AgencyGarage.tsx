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
    <section id="why-us" className="bg-[#f8f9fa] py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">
          {/* Left column: header + description + image */}
          <div className="w-full lg:w-1/2 space-y-8 lg:space-y-10">
            {/* Header & subtext */}
            <div className="text-center lg:text-left">
              <p className="text-amber-600 uppercase tracking-wider font-semibold text-sm md:text-base mb-3">
                ── WHY AGENCY GARAGE ──
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Built for the Way
                <span className="text-amber-600"> You Work</span>
              </h2>
              <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                Real estate agencies have unique fleet demands — high visibility
                vehicles, tight schedules, and brand reputation on the line
                every day. We built Agency Garage specifically for this reality.
              </p>
            </div>

            {/* Image with orange accent frame (like screenshot) */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-amber-500/30 shadow-xl">
              <img
                src="/images/agency.jpg"
                alt="Aerial view of neatly parked real estate agency vehicles"
                className="w-full h-90 object-cover transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
                width={800}
                height={600}
              />
              {/* Subtle inner white frame like screenshot style */}
              <div className="absolute inset-3 border border-white/60 pointer-events-none rounded-lg" />
            </div>
          </div>

          {/* Right column: numbered list with separators */}
          <div className="w-full lg:w-1/2">
            <div className="divide-y divide-gray-200">
              {benefits.map((benefit) => (
                <div
                  key={benefit.number}
                  className="py-4 md:py-4 first:pt-0 last:pb-0 flex items-start gap-5 md:gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-lg md:text-xl flex items-center justify-center border-2 border-amber-300">
                      {benefit.number}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-md md:text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
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

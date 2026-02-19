import type { FC } from "react";
import Image from "next/image";

const features = [
  {
    icon: "/images/Reporting.svg",
    title: "Cost Analytics",
    desc: "Track spend trends across your entire fleet",
  },
  {
    icon: "/images/Servicing.svg",
    title: "Smart Alerts",
    desc: "Service, rego, and upgrade reminders",
  },
  {
    icon: "/images/fleet.svg",
    title: "Vehicle Tracking",
    desc: "Real-time status of every vehicle",
  },
  {
    icon: "/images/Fuel & usage.svg",
    title: "Performance",
    desc: "KM efficiency and usage reporting",
  },
  {
    icon: "/images/Registration.svg",
    title: "Compliance",
    desc: "ATO-compliant logbook and reporting",
  },
  {
    icon: "/images/Driver.svg",
    title: "AI Insights",
    desc: "Data-driven fleet recommendations",
  },
];

const Fleet360App: FC = () => {
  return (
    <section id="app" className="bg-[#0B0F1A] text-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center lg:text-left mb-16">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C46A0A]" />
            <p className="text-[#C46A0A] uppercase tracking-[0.2em] text-[11px] font-bold">
              FLEET360 APP
            </p>
          </div>

          <h2 className="text-5xl sm:text-6xl font-serif font-bold leading-tight mb-8">
            Your Entire Fleet,{" "}
            <span className="text-[#C46A0A] italic font-serif">
              At a Glance
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed font-light">
            The Fleet360 app gives principals and agents complete visibility
            over vehicle status, costs, and compliance — from a single
            dashboard. Every package includes app access, with premium tiers
            unlocking AI-driven recommendations and multi-office views.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left side - Features list */}
          <div className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="w-6 h-6 bg-[#C46A0A]"
                    style={{
                      maskImage: `url('${feature.icon}')`,
                      WebkitMaskImage: `url('${feature.icon}')`,
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Image / Mockup */}
          <div className="w-full lg:w-7/12">
            <div className="relative">
              <img
                src="/images/fleet360.jpg"
                alt="Fleet360 app dashboard"
                className="w-full h-auto object-cover shadow-2xl"
                loading="lazy"
              />
              {/* Corner accent border */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b-2 border-l-2 border-[#C46A0A]/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fleet360App;

import React from "react";

type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Tell Us About Your Fleet",
    description:
      "Share your agency details, fleet size, and current pain points. We'll assess your needs and recommend the right package.",
  },
  {
    number: "02",
    title: "We Handle the Setup",
    description:
      "We onboard your vehicles, set up your dashboard, coordinate with your existing providers, and get everything running smoothly.",
  },
  {
    number: "03",
    title: "Sit Back & Drive",
    description:
      "Your fleet runs like clockwork. One monthly fee, one dashboard, one point of contact. You focus on selling property.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="w-16 h-[1px] bg-[#C9C5BF]" />
          <p className="text-[11px] tracking-[0.3em] text-[#888] uppercase font-semibold">
            HOW IT WORKS
          </p>
          <span className="w-16 h-[1px] bg-[#C9C5BF]" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1A1A1A] mb-24">
          Getting Started is{" "}
          <span className="italic font-serif text-[#C46A0A]">Simple</span>
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector Line (Desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-[2rem] left-[50%] w-full h-[1px] bg-gray-200 -z-10" />
              )}

              {/* Step Number */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 flex items-center justify-center bg-[#F9F6F2] text-[#C46A0A] font-serif font-bold text-xl rounded-sm">
                  {step.number}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-7 max-w-xs mx-auto font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

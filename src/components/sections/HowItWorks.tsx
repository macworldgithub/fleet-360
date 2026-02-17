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
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="w-12 bg-[#C46A0A]" />
          <p className="text-xs tracking-[0.4em] text-[#C46A0A] uppercase">
            How It Works
          </p>
          <span className="w-12 bg-[#C46A0A]" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-20">
          Getting Started is{" "}
          <span className="italic text-[#C46A0A] font-medium">Simple</span>
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Step Number */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 flex items-center justify-center border border-gray-300 text-[#C46A0A] font-semibold text-lg bg-[#F9F6F2]">
                  {step.number}
                </div>
              </div>

              {/* Connector Line (Desktop only) */}
              {index < steps.length - 1 && (
                <span className="hidden md:block absolute top-8 right-[-50%] w-full bg-gray-300" />
              )}

              {/* Title */}
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
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

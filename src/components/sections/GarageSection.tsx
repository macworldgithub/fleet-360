import type { FC } from "react";

const AgencyGarageSection: FC = () => {
  return (
    <section id="services" className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-16 lg:mb-6 text-center md:text-left">
          <p className="text-[#F59E0B] uppercase tracking-wide font-medium text-sm md:text-base mb-3 md:mb-4">
            — WHAT WE DO
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Everything Your Fleet Needs,
            <br className="hidden sm:block" />
            <span className="text-[#F59E0B]">Under One Roof</span>
          </h2>
        </div>

        {/* Main content - flex on md+ screens */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text block */}
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left">
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              From the moment a vehicle joins your agency to the day it's sold
              or replaced, Agency Garage handles every detail. We coordinate
              servicing, track costs, manage compliance, and keep your fleet
              looking its best — so your team can focus on selling property.
            </p>
          </div>

          {/* Image block */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/mechanic.jpg"
                alt="Mechanic working on agency vehicle in professional setting"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />

              {/* Optional subtle overlay gradient */}
              <div className="absolute inset-0 from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencyGarageSection;

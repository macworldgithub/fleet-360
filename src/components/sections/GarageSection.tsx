import type { FC } from "react";

const AgencyGarageSection: FC = () => {
  return (
    <section id="services" className="bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text block */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <span className="w-12 h-[1px] bg-[#C46A0A]" />
              <p className="text-[11px] tracking-[0.3em] text-[#C46A0A] uppercase font-bold">
                WHAT WE DO
              </p>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-[56px] font-serif font-bold text-[#1A1A1A] leading-[1.1] mb-8">
              Everything Your Fleet Needs,{" "}
              <span className="font-serif italic text-[#C46A0A]">
                Under One Roof
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light">
              From the moment a vehicle joins your agency to the day it's sold
              or replaced, Agency Garage handles every detail. We coordinate
              servicing, track costs, manage compliance, and keep your fleet
              looking its best — so your team can focus on selling property.
            </p>
          </div>

          {/* Image block */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src="/images/mechanic.jpg"
                alt="Mechanic working on agency vehicle in professional setting"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              {/* Corner accent border */}
              <div className="hidden lg:block absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-[#E29A5F]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencyGarageSection;

import type { FC } from "react";
import Image from "next/image";

interface Addon {
  icon: string;
  title: string;
  description: string;
  note?: string;
}

const addons: Addon[] = [
  {
    icon: "/images/Registration.svg",
    title: "Additional Roadside Coverage",
    description: "Extended roadside assistance beyond standard inclusions.",
  },
  {
    icon: "/images/Enchanced.svg",
    title: "Enhanced Detailing Packages",
    description:
      "Premium interior and exterior detailing to keep your fleet showroom-ready.",
  },
  {
    icon: "/images/Payments.svg",
    title: "Custom Branding Programs",
    description: "Coordinated vehicle branding, decals, and livery management.",
  },
  {
    icon: "/images/Driver.svg",
    title: "Driver Behaviour Insights",
    description:
      "Coming soon — data-driven insights into driver patterns and efficiency.",
  },
  {
    icon: "/images/Insuarance.svg",
    title: "Insurance Coordination",
    description:
      "Streamlined insurance management and claims coordination for your fleet.",
  },
  {
    icon: "/images/Endofyear.svg",
    title: "End-of-Year Fleet Tax Packs",
    description:
      "Comprehensive tax documentation ready for your accountant at EOFY.",
  },
];

const OptionalAddons: FC = () => {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 h-[1px] bg-[#C46A0A]" />
            <p className="text-[#C46A0A] uppercase tracking-[0.2em] text-[11px] font-bold">
              OPTIONAL ADD-ONS
            </p>
            <span className="w-16 h-[1px] bg-[#C46A0A]" />
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1A1A1A] mb-8">
            Tailor Your Package
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Available with any package. Add what you need, when you need it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {addons.map((addon, index) => (
            <div
              key={index}
              className="flex items-start gap-6 p-8 border border-gray-100/50 hover:border-gray-100 bg-[#FFFCF8] rounded-sm transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-8 h-8 bg-[#C46A0A]"
                  style={{
                    maskImage: `url('${addon.icon}')`,
                    WebkitMaskImage: `url('${addon.icon}')`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>

              <div className="flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-3">
                  {addon.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed font-light">
                  {addon.description}
                </p>

                {/* Optional note */}
                {addon.note && (
                  <div className="mt-3 inline-block">
                    <span className="text-[#C46A0A] text-xs font-bold tracking-widest uppercase border-b border-[#C46A0A] pb-0.5">
                      {addon.note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default OptionalAddons;

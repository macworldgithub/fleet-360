import type { FC } from "react";

interface Addon {
  icon: string;
  title: string;
  description: string;
  note?: string;
}

const addons: Addon[] = [
  {
    icon: "🛣️",
    title: "Additional Roadside Coverage",
    description: "Extended roadside assistance beyond standard inclusions.",
  },
  {
    icon: "🧼",
    title: "Enhanced Detailing Packages",
    description:
      "Premium interior and exterior detailing to keep your fleet showroom-ready.",
  },
  {
    icon: "🎨",
    title: "Custom Branding Programs",
    description: "Coordinated vehicle branding, decals, and livery management.",
  },
  {
    icon: "📊",
    title: "Driver Behaviour Insights",
    description:
      "Coming soon — data-driven insights into driver patterns and efficiency.",
  },
  {
    icon: "🛡️",
    title: "Insurance Coordination",
    description:
      "Streamlined insurance management and claims coordination for your fleet.",
  },
  {
    icon: "📑",
    title: "End-of-Year Fleet Tax Packs",
    description:
      "Comprehensive tax documentation ready for your accountant at EOFY.",
  },
];

const OptionalAddons: FC = () => {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-full px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-amber-600 uppercase tracking-wider font-semibold text-sm md:text-base mb-3">
            ── OPTIONAL ADD-ONS ──
          </p>
          <h2 className="text-  xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
            Tailor Your Package
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Available with any package. Add what you need, when you need it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {addons.map((addon, index) => (
            <div
              key={index}
              className={`
                group bg-white rounded-2xl 
                transition-all duration-300 overflow-hidden border border-gray-300
                flex flex-col h-full
                ${addon.note ? "opacity-85 hover:opacity-100" : ""}
              `}
            >
              <div className="p-6 md:p-8 flex flex-col">
                {/* Icon */}
                <div className="text-xl md:text-3xl mb-1 md:mb-3 text-amber-500">
                  {addon.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-3">
                  {addon.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {addon.description}
                </p>

                {/* Optional note (Coming soon, etc.) */}
                {addon.note && (
                  <div className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                    {addon.note}
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

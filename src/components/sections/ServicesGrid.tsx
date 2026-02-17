import type { FC } from "react";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    icon: "🚗",
    title: "Vehicle Lifecycle",
    description:
      "Buy, run, upgrade, sell — we oversee every stage of your vehicle’s life so you never miss a beat.",
  },
  {
    icon: "🔧",
    title: "Servicing & Maintenance",
    description:
      "Coordinated servicing through preferred providers, mobile mechanics, and proactive scheduling.",
  },
  {
    icon: "🛡️",
    title: "Registration & Compliance",
    description:
      "Registration management, reminders, and ATO-compliant mobile logbook tracking.",
  },
  {
    icon: "⛽",
    title: "Fuel & Usage Tracking",
    description:
      "Fuel spend monitoring, KM efficiency reporting, and automated private vs business split.",
  },
  {
    icon: "📊",
    title: "Reporting & Analytics",
    description:
      "Centralised invoicing, cost benchmarking, lifecycle reporting, and accountant-friendly exports.",
  },
  {
    icon: "💳",
    title: "Payments & Rewards",
    description:
      "Direct debit, credit card (Amex accepted), and earn rewards points on your fleet spend.",
  },
  {
    icon: "🧼",
    title: "Cleaning & Presentation",
    description:
      "Scheduled wash programs and enhanced detailing to keep your brand looking sharp on the road.",
  },
  {
    icon: "📱",
    title: "Fleet App",
    description:
      "Real-time dashboard, vehicle status, cost tracking, alerts, and AI-driven recommendations.",
  },
];

const ServicesGrid: FC = () => {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-20">
      <div className="mx-auto w-full px-5 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-gray-300 flex flex-col h-full"
            >
              <div className="p-6 md:p-8 flex flex-col">
                {/* Icon */}
                <div className="text-4xl md:text-5xl mb-5 md:mb-6 text-amber-500">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;

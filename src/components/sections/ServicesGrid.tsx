import type { FC } from "react";
import Image from "next/image";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    icon: "/images/Vehicle Lifecycle.svg",
    title: "Vehicle Lifecycle",
    description:
      "Buy, run, upgrade, sell — we oversee every stage of your vehicle’s life so you never miss a beat.",
  },
  {
    icon: "/images/Servicing.svg",
    title: "Servicing & Maintenance",
    description:
      "Coordinated servicing through preferred providers, mobile mechanics, and proactive scheduling.",
  },
  {
    icon: "/images/Registration.svg",
    title: "Registration & Compliance",
    description:
      "Registration management, reminders, and ATO-compliant mobile logbook tracking.",
  },
  {
    icon: "/images/Registration.svg",
    title: "Fuel & Usage Tracking",
    description:
      "Fuel spend monitoring, KM efficiency reporting, and automated private vs business split.",
  },
  {
    icon: "/images/Reporting.svg",
    title: "Reporting & Analytics",
    description:
      "Centralised invoicing, cost benchmarking, lifecycle reporting, and accountant-friendly exports.",
  },
  {
    icon: "/images/Payments.svg",
    title: "Payments & Rewards",
    description:
      "Direct debit, credit card (Amex accepted), and earn rewards points on your fleet spend.",
  },
  {
    icon: "/images/fleet.svg",
    title: "Cleaning & Presentation",
    description:
      "Scheduled wash programs and enhanced detailing to keep your brand looking sharp on the road.",
  },
  {
    icon: "/images/Payments.svg",
    title: "Fleet App",
    description:
      "Real-time dashboard, vehicle status, cost tracking, alerts, and AI-driven recommendations.",
  },
];

const ServicesGrid: FC = () => {
  return (
    <section className="bg-[#F9F9F9] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-[#E6E6E6] p-8 transition-all duration-300 hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-6">
                <div
                  className="w-7 h-7 bg-[#C46A0A]"
                  style={{
                    maskImage: `url('${service.icon}')`,
                    WebkitMaskImage: `url('${service.icon}')`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>

              {/* Title */}
              <h3 className="text-[20px] leading-snug font-semibold text-[#1F1F1F] mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] leading-relaxed text-[#5F5F5F]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;

import type { FC } from "react";

const features = [
  {
    icon: "📊",
    title: "Cost Analytics",
    desc: "Track spend trends across your entire fleet",
  },
  {
    icon: "🔔",
    title: "Smart Alerts",
    desc: "Service, rego, and upgrade reminders",
  },
  {
    icon: "📍",
    title: "Vehicle Tracking",
    desc: "Real-time status of every vehicle",
  },
  {
    icon: "⚡",
    title: "Performance",
    desc: "KM efficiency and usage reporting",
  },
  {
    icon: "🛡️",
    title: "Compliance",
    desc: "ATO-compliant logbook and reporting",
  },
  {
    icon: "🤖",
    title: "AI Insights",
    desc: "Data-driven fleet recommendations",
  },
];

const Fleet360App: FC = () => {
  return (
    <section
      id="app"
      className="bg-gray-900 text-white py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center lg:text-left mb-12 md:mb-16">
          <p className="text-amber-500 uppercase tracking-wider font-semibold text-sm md:text-base mb-3">
            ── FLEET360 APP ──
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Your Entire Fleet,
            <br className="hidden sm:block" />
            <span className="text-amber-500">At a Glance</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto lg:mx-0 leading-relaxed">
            The Fleet360 app gives principals and agents complete visibility
            over vehicle status, costs, and compliance — from a single
            dashboard. Every package includes app access, with premium tiers
            unlocking AI-driven recommendations and multi-office views.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20">
          {/* Left side - Features list */}
          <div className="w-full lg:w-5/12 xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="text-3xl sm:text-4xl text-amber-500 mt-1 flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Image / Mockup */}
          <div className="w-full lg:w-7/12 xl:w-1/2">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-gray-800">
              <img
                src="/images/fleet360.jpg" // ← replace with your actual image path
                alt="Fleet360 app dashboard showing analytics, map, cost graphs on large monitor"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
                width={1200}
                height={800}
              />

              {/* Optional subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Small hint text under image (optional) */}
            <p className="text-center text-gray-500 text-sm mt-4 lg:mt-6">
              Real-time dashboard • Cost analytics • Vehicle map • AI
              recommendations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fleet360App;

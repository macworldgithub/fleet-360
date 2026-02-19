import React from "react";

const stats = [
  {
    value: "1",
    label: "MONTHLY FEE",
  },
  {
    value: "24/7",
    label: "ROADSIDE ASSIST",
  },
  {
    value: "100%",
    label: "ATO COMPLIANT",
  },
  {
    value: "5–6",
    label: "SUPPLIERS REPLACED",
  },
];

const Philosophy: React.FC = () => {
  return (
    <section className="bg-[#F9F6F2] py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Small Label */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="w-16 h-[1px] bg-[#C46A0A]" />
          <p className="text-[11px] tracking-[0.3em] text-[#C46A0A] uppercase font-bold">
            OUR PHILOSOPHY
          </p>
          <span className="w-16 h-[1px] bg-[#C46A0A]" />
        </div>

        {/* Main Quote */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif italic text-[#1A1A1A] leading-relaxed max-w-5xl mx-auto">
          "We don't just manage vehicles — we bundle, optimise, and simplify
          everything related to running cars in a real estate business."
        </h2>

        {/* Description */}
        <p className="mt-10 text-gray-500 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-light">
          From registration and servicing to fuel tracking and resale — Agency
          Garage replaces five or six separate suppliers with one seamless
          partnership, one monthly fee, and one clear view of your entire fleet.
        </p>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {stats.map((item) => (
            <div key={item.label} className="flex flex-col items-center py-8 md:py-0 px-4">
              <p className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#C46A0A] mb-4">
                {item.value}
              </p>
              <p className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

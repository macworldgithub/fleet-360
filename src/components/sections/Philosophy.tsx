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
    <section className="bg-[#F4F1EC] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Small Heading */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="w-12  bg-[#C46A0A]" />
          <p className="text-xs tracking-[0.4em] text-[#C46A0A] uppercase">
            Our Philosophy
          </p>
          <span className="w-12 bg-[#C46A0A]" />
        </div>

        {/* Main Quote */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic font-medium text-[#1A1A1A] leading-relaxed max-w-4xl mx-auto">
          “We don't just manage vehicles — we bundle, optimise, and simplify
          everything related to running cars in a real estate business.”
        </h2>

        {/* Description */}
        <p className="mt-8 text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          From registration and servicing to fuel tracking and resale — Agency
          Garage replaces five or six separate suppliers with one seamless
          partnership, one monthly fee, and one clear view of your entire fleet.
        </p>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className="flex flex-col items-center relative"
            >
              <p className="text-3xl md:text-4xl font-semibold text-[#C46A0A]">
                {item.value}
              </p>
              <p className="mt-3 text-xs tracking-[0.3em] text-gray-500">
                {item.label}
              </p>

              {/* Divider (desktop only) */}
              {index !== stats.length - 1 && (
                <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

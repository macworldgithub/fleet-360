"use client";

import React from "react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center text-white"
      style={{
        backgroundImage: "url('/images/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0  from-[#0B0F1A]/95 via-[#0B0F1A]/80 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        {/* Small Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 bg-[#C97A1C]" />
          <p className="text-md tracking-[0.3em] text-[#C97A1C] uppercase font-extrabold">
            Real Estate Fleet Partner
          </p>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl">
          Your Fleet,{" "}
          <span className="text-[#E29A5F] italic font-medium">Simplified.</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg text-white max-w-2xl leading-relaxed">
          We bundle, optimise, and simplify everything related to running
          vehicles in a real estate business. One partner instead of five
          suppliers.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="#"
            className="bg-[#C97A1C] hover:bg-[#b96d17] transition px-8 py-4 text-sm font-semibold tracking-wide"
          >
            VIEW PACKAGES
          </Link>

          <Link
            href="#"
            className="border border-gray-400 hover:border-white hover:text-white transition px-8 py-4 text-sm font-semibold tracking-wide"
          >
            OUR SERVICES
          </Link>
        </div>

        {/* Bottom Features */}
        <div className="mt-16 flex flex-col sm:flex-row gap-8 text-sm text-white">
          <div className="flex items-center gap-3">
            <span className="text-[#C97A1C]">🛡</span>
            <p>One Monthly Fee</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#C97A1C]">⏱</span>
            <p>Less Admin</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#C97A1C]">📈</span>
            <p>Better Decisions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Clock, TrendingUp } from "lucide-react";

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
      <div className="absolute inset-0 bg-[#0B0F1A]/85" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-serif font-bold leading-[1.1] max-w-5xl tracking-tight">
          Your Fleet,{" "}
          <span className="text-[#C46A0A] italic font-serif">Simplified.</span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed font-light">
          We bundle, optimise, and simplify everything related to running
          vehicles in a real estate business. One partner instead of five
          suppliers.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <Link
            href="#packages"
            className="bg-[#C46A0A] hover:bg-[#a85908] transition px-10 py-4 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase rounded-sm text-center"
          >
            VIEW PACKAGES
          </Link>

          <Link
            href="#services"
            className="border border-white/30 hover:bg-white hover:text-black transition px-10 py-4 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase rounded-sm text-center backdrop-blur-sm"
          >
            OUR SERVICES
          </Link>
        </div>

        {/* Bottom Features */}
        <div className="mt-20 flex flex-col sm:flex-row gap-8 sm:gap-12 text-sm sm:text-base font-medium text-white/90">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C46A0A]" />
            <p>One Monthly Fee</p>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#C46A0A]" />
            <p>Less Admin</p>
          </div>

          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#C46A0A]" />
            <p>Better Decisions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

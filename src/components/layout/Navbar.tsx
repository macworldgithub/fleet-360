"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "SERVICES", href: "#services" },
    { label: "PACKAGES", href: "#packages" },
    { label: "APP", href: "#app" },
    { label: "WHY US", href: "#why-us" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <div className="bg-[#C46A0A] text-white font-serif font-bold text-xl px-2 py-1 flex items-center justify-center rounded-sm">
            AG
          </div>
          <div className="flex flex-col">
            <p className="font-serif text-2xl font-bold text-gray-900 leading-none tracking-tight">
              Agency Garage
            </p>
            <p className="text-[10px] tracking-[0.25em] text-[#C46A0A] font-sans font-medium mt-0.5">
              FLEET360
            </p>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.1em] font-medium text-gray-600 hover:text-[#C46A0A] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA BUTTON */}
        <div className="hidden lg:flex">
          <Link
            href="#contact"
            className="flex items-center gap-2 bg-[#C46A0A] text-white px-8 py-3.5 text-xs font-bold tracking-widest hover:bg-[#a85908] transition uppercase rounded-sm"
          >
            <Phone className="w-4 h-4 fill-white" />
            GET STARTED
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-gray-800"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 absolute w-full left-0 top-24 shadow-lg">
          <div className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm uppercase tracking-widest text-gray-700 hover:text-[#C46A0A] font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="#contact"
              className="mt-4 flex items-center justify-center gap-2 bg-[#C46A0A] text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#a85908] transition"
              onClick={() => setOpen(false)}
            >
              <Phone className="w-4 h-4 fill-white" />
              GET STARTED
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

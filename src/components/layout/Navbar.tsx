"use client";

import React, { useState } from "react";
import Link from "next/link";

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
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="bg-[#C46A0A] text-white font-bold px-3 py-2 text-sm">
            AG
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-none">
              Agency Garage
            </p>
            <p className="text-xs tracking-widest text-[#C46A0A]">FLEET360</p>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm tracking-widest text-gray-700 hover:text-black transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA BUTTON */}
        <div className="hidden lg:flex">
          <Link
            href="#"
            className="flex items-center gap-2 bg-[#C46A0A] text-white px-6 py-3 text-sm font-semibold hover:bg-[#a85908] transition"
          >
            ☎ GET STARTED
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
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm tracking-widest text-gray-700 hover:text-black"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="#"
              className="mt-4 bg-[#C46A0A] text-white px-6 py-3 text-sm font-semibold text-center"
              onClick={() => setOpen(false)}
            >
              ☎ GET STARTED
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

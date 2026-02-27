"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, LogIn, User, LogOut } from "lucide-react";
import { useAuth } from "@/src/api/auth";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, agency, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push("/");
  };

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

        {/* CTA BUTTONS */}
        <div className="hidden lg:flex items-center gap-4 ml-6">
          {agency && (
            <button
              type="button"
              onClick={() => {
                if (agency.role === "PRINCIPAL") {
                  router.push("/principal");
                } else if (agency.role === "FLEET_MANAGER") {
                  router.push("/fleet-manager");
                }
              }}
              className="flex items-center gap-2 border-2 border-[#C46A0A] text-[#C46A0A] px-3.5 py-1.5 text-[10px] font-bold tracking-widest hover:bg-[#C46A0A] hover:text-white transition uppercase rounded-sm"
            >
              {agency.role === "PRINCIPAL"
                ? "PRINCIPAL DASHBOARD"
                : "FLEET MANAGER DASHBOARD"}
            </button>
          )}

          <Link
            href="#contact"
            className="flex items-center gap-2 bg-[#C46A0A] text-white px-8 py-3.5 text-xs font-bold tracking-widest hover:bg-[#a85908] transition uppercase rounded-sm"
          >
            <Phone className="w-4 h-4 fill-white" />
            GET STARTED
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C46A0A] text-white hover:bg-[#a85908] transition"
                title={agency?.agencyName}
              >
                <User className="w-5 h-5" />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {agency?.agencyName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {agency?.contactEmail}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Role: <span className="font-medium text-gray-900">{agency?.role}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tier: <span className="font-medium text-gray-900">{agency?.subscriptionTier}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 border-2 border-[#C46A0A] text-[#C46A0A] px-8 py-3 text-xs font-bold tracking-widest hover:bg-[#C46A0A] hover:text-white transition uppercase rounded-sm"
            >
              <LogIn className="w-4 h-4" />
              SIGN IN
            </Link>
          )}
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
              className="flex items-center justify-center gap-2 bg-[#C46A0A] text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#a85908] transition"
              onClick={() => setOpen(false)}
            >
              <Phone className="w-4 h-4 fill-white" />
              GET STARTED
            </Link>

            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {agency?.agencyName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {agency?.contactEmail}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Role: <span className="font-medium text-gray-900">{agency?.role}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tier: <span className="font-medium text-gray-900">{agency?.subscriptionTier}</span>
                  </p>
                </div>
                {agency && (
                  <button
                    onClick={() => {
                      if (agency.role === "PRINCIPAL") {
                        router.push("/principal");
                      } else if (agency.role === "FLEET_MANAGER") {
                        router.push("/fleet-manager");
                      }
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 mb-3 border-2 border-[#C46A0A] text-[#C46A0A] px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#C46A0A] hover:text-white transition rounded-sm"
                  >
                    {agency.role === "PRINCIPAL"
                      ? "Principal Dashboard"
                      : "Fleet Manager Dashboard"}
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-red-700 transition rounded-sm"
                >
                  <LogOut className="w-4 h-4" />
                  SIGN OUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 border-2 border-[#C46A0A] text-[#C46A0A] px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#C46A0A] hover:text-white transition"
                onClick={() => setOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

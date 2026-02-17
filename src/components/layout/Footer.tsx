import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0F1A] text-gray-300">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#C97A1C] text-white font-bold px-3 py-2 text-sm">
                AG
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Agency Garage
                </h3>
                <p className="text-xs tracking-widest text-gray-400">
                  FLEET360
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Australia's real estate fleet management partner. One monthly fee,
              clear visibility, less admin, better decisions.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="text-[#C97A1C] text-xs tracking-widest mb-5">
              SERVICES
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Vehicle Lifecycle",
                "Servicing & Maintenance",
                "Fleet Analytics",
                "Compliance & Reporting",
                "Fuel Management",
                "Cleaning & Presentation",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-white transition cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* PACKAGES */}
          <div>
            <h4 className="text-[#C97A1C] text-xs tracking-widest mb-5">
              PACKAGES
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Essential Fleet Care",
                "Optimised Fleet",
                "Agency Fleet Partner",
                "Optional Add-Ons",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-white transition cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-[#C97A1C] text-xs tracking-widest mb-5">
              CONTACT
            </h4>

            <ul className="space-y-3 text-sm">
              <li>1300 FLEET 360</li>
              <li>hello@agencygarage.com.au</li>
              <li>Sydney, Australia</li>
            </ul>

            {/* PAYMENTS */}
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-3 tracking-widest">
                PAYMENTS ACCEPTED
              </p>
              <div className="flex gap-2">
                {["VISA", "MC", "AMEX"].map((card) => (
                  <div
                    key={card}
                    className="border border-gray-600 px-3 py-1 text-xs text-gray-300"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            © 2026 Agency Garage Pty Ltd. All rights reserved. ABN 00 000 000
            000
          </p>

          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

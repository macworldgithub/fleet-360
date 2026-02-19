"use client";

import { useState } from "react";

const fleetSizes = [
  "1–5 vehicles",
  "6–10 vehicles",
  "11–20 vehicles",
  "21–50 vehicles",
  "51–100 vehicles",
  "100+ vehicles",
] as const;

type FleetSize = (typeof fleetSizes)[number] | "";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "John Smith",
    email: "john@agency.com.au",
    agency: "Smith Real Estate",
    fleetSize: "" as FleetSize,
    message: "Tell us about your fleet needs...",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Enquiry sent! (demo)");
  };

  return (
    <section id="contact" className="bg-[#F9F6F2]">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto pb-12">
        {/* Left - Hero Text */}
        <div className="w-full lg:w-5/12 bg-[#0B0F1A] p-12 lg:p-20 flex flex-col justify-center text-white">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-[#C46A0A]" />
              <p className="text-[#C46A0A] uppercase tracking-[0.2em] text-[11px] font-bold">
                GET IN TOUCH
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-8">
              Ready to Simplify <span className="text-[#C46A0A] italic font-serif">Your Fleet?</span>
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Tell us about your agency and fleet. We'll put together a
              tailored proposal within 24 hours.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 text-gray-300 text-sm">
            <div className="flex items-center gap-4">
              <span className="text-[#C46A0A]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <span className="tracking-wide">1300 FLEET 360</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#C46A0A]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <span className="tracking-wide">hello@agencygarage.com.au</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#C46A0A]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <span className="tracking-wide">Sydney, Australia</span>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full lg:w-7/12 bg-[#F9F6F2] p-12 lg:p-20 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full"
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest"
                >
                  YOUR NAME
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-[#C46A0A]/50 transition shadow-sm placeholder-gray-300"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-[#C46A0A]/50 transition shadow-sm placeholder-gray-300"
                  required
                />
              </div>
            </div>

            {/* Agency + Fleet Size row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="agency"
                  className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest"
                >
                  AGENCY NAME
                </label>
                <input
                  type="text"
                  id="agency"
                  name="agency"
                  value={formData.agency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-[#C46A0A]/50 transition shadow-sm placeholder-gray-300"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="fleetSize"
                  className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest"
                >
                  FLEET SIZE
                </label>
                <select
                  id="fleetSize"
                  name="fleetSize"
                  value={formData.fleetSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-[#C46A0A]/50 transition shadow-sm appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select fleet size
                  </option>
                  {fleetSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest"
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-600 text-sm focus:outline-none focus:border-[#C46A0A]/50 transition shadow-sm resize-none placeholder-gray-300"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-[#C46A0A] hover:bg-[#a85908] text-white text-xs font-bold py-4 px-8 uppercase tracking-[0.15em] transition duration-200 flex items-center gap-3 rounded-sm"
              >
                SEND ENQUIRY
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

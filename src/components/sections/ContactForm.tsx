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
    // Here you would normally send to API / Formspree / etc.
    console.log("Form submitted:", formData);
    alert("Enquiry sent! (demo)");
  };

  return (
    <section id="contact" className="bg-white pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
        {/* Left - Hero Text */}
        <div className="bg-gray-950 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <p className="text-orange-400 uppercase tracking-wider text-sm font-medium mb-4">
              ─ GET IN TOUCH
            </p>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
              Ready to <span className="text-orange-400">Simplify</span> Your{" "}
              <span className="text-orange-400">Fleet</span>?
            </h2>

            <p className="text-gray-300 text-lg md:text-xl mb-8">
              Tell us about your agency and fleet. We&apos;ll put together a
              tailored proposal within 24 hours.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-gray-300 text-sm pt-2">
            <div className="flex items-center gap-3">
              <span className="text-orange-400 text-xl">☎</span>
              <span>1300 FLEET 360</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-orange-400 text-xl">✉</span>
              <span>hello@agencygarage.com.au</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-orange-400 text-xl">📍</span>
              <span>Sydney, Australia</span>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-[#F4F1EC] p-8 md:p-12 lg:p-8 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-lg mx-auto w-full"
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  YOUR NAME
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>
            </div>

            {/* Agency + Fleet Size row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="agency"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  AGENCY NAME
                </label>
                <input
                  type="text"
                  id="agency"
                  name="agency"
                  value={formData.agency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="fleetSize"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  FLEET SIZE
                </label>
                <select
                  id="fleetSize"
                  name="fleetSize"
                  value={formData.fleetSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 focus:outline-none focus:border-orange-500 transition appearance-none"
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
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 group"
            >
              SEND ENQUIRY →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

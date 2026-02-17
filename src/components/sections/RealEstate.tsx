import type { FC } from "react";
import Link from "next/link";

const BuiltForRealEstate: FC = () => {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 xl:gap-20">
          {/* Image - left on desktop, top on mobile */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
              <img
                src="/images/packages.jpg"
                alt="Real estate agent standing next to branded agency SUV holding tablet at sunset"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 lg:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Built for Real Estate
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              We understand that your vehicles are more than transport — they're
              your brand on the road. Agency Garage is purpose-built for the
              unique demands of real estate agencies, from brand consistency
              across your fleet to minimising downtime during your busiest
              auction weekends.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-amber-500 text-white font-semibold text-base md:text-lg rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Explore Our Packages
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuiltForRealEstate;

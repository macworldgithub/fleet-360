import WhyAgencyGarage from "../components/sections/AgencyGarage";
import ContactForm from "../components/sections/ContactForm";
import Fleet360App from "../components/sections/Fleet360App";
import AgencyGarageSection from "../components/sections/GarageSection";
import Hero from "../components/sections/Hero";
import HowItWorks from "../components/sections/HowItWorks";
import OptionalAddons from "../components/sections/OptionalAddons";
import PackagesSection from "../components/sections/packages";
import Philosophy from "../components/sections/Philosophy";
import BuiltForRealEstate from "../components/sections/RealEstate";
import ServicesGrid from "../components/sections/ServicesGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <HowItWorks />
      <AgencyGarageSection />
      <ServicesGrid />
      <BuiltForRealEstate />
      <PackagesSection />
      <OptionalAddons />
      <Fleet360App />
      <WhyAgencyGarage />
      <ContactForm />
    </>
  );
}

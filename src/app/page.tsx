"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/api/auth";
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
  const router = useRouter();
  const { agency, isAuthenticated } = useAuth();

  const handleGoToDashboard = () => {
    if (!agency) return;

    if (agency.role === "PRINCIPAL") {
      router.push("/principal");
    } else if (agency.role === "FLEET_MANAGER") {
      router.push("/fleet-manager");
    }
  };

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

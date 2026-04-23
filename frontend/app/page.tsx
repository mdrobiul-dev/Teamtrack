import { BenefitsSection } from "./components/landing/benefits-section";
import { FinalCTA } from "./components/landing/final-cta";
import { Footer } from "./components/landing/footer";
import { HeroSection } from "./components/landing/hero-section";
import { Navbar } from "./components/landing/navbar";
import { SocialProof } from "./components/landing/social-proof";
import { UseCasesSection } from "./components/landing/use-cases-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <BenefitsSection />
      <UseCasesSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}

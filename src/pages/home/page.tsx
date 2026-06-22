import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import StatsBar from "./components/StatsBar";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AuthoritySection from "./components/AuthoritySection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import { FooterSection } from "./components/FooterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <StatsBar />
        <ServicesSection />
        <ProcessSection />
        <TestimonialsSection />
        <AuthoritySection />
        <FAQSection />
        <CTASection />
      </main>
      <FooterSection />
    </>
  );
}

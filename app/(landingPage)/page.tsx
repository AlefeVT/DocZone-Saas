import { BenefitsSection } from './_components/Benefits';
import { ContactSection } from './_components/Contact';
import { FeaturesSection } from './_components/Features';
import { HeroSection } from './_components/Hero';
import Pricing from './_components/Pricing';
import { TestimonialsSection } from './_components/Testimonials';

export default function Component() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <Pricing />
      <ContactSection />
    </main>
  );
}

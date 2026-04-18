'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { AchievementsSection } from '@/components/landing/AchievementsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--surface))] text-foreground selection:bg-[hsl(var(--primary))]/30">
      <HeroSection />
      <FeaturesSection />
      <TechStackSection />
      <AchievementsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

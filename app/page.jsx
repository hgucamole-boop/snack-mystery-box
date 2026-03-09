'use client';
import { useState, useEffect } from 'react';
import { loadGAScript } from './utils/ga';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ProductShowcase } from './components/ProductShowcase';
import { PricingSection } from './components/PricingSection';
import { SignupSection } from './components/SignupSection';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProductGacha } from './components/ProductGacha';

export default function SnackBoxLanding() {
  const [selectedPlan, setSelectedPlan] = useState('team');

  useEffect(() => {
    const cleanup = loadGAScript();
    return cleanup;
  }, []);

  return (
    <div className="landing-container">
      <Navbar />
      <div className="page-content">
        <HeroSection />
        <FeaturesSection />
        {/* <ProductShowcase /> */}
        <ProductGacha></ProductGacha>
        <PricingSection selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
        <SignupSection selectedPlan={selectedPlan} />
      </div>
      <Footer />
    </div>
  );
}
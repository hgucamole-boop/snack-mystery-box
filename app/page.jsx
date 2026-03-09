'use client';
import { useState, useEffect } from 'react';
import { loadGAScript } from './utils/ga';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { SlotMachineSection } from './components/SlotMachineSection';
import { PricingSection } from './components/PricingSection';
import { SignupSection } from './components/SignupSection';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ImpactCounter } from './components/ImpactCounter';

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
        <ImpactCounter />
        <FeaturesSection />
        {/* WIP for now, code is broken af */}
        {/* <SlotMachineSection /> */} 
        <PricingSection selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
        <SignupSection selectedPlan={selectedPlan} />
      </div>
      <Footer />
    </div>
  );
}
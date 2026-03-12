'use client';
import { useState, useEffect } from 'react';
import { HeroSection } from '@/app/home/components/HeroSection';
import { FeaturesSection } from '@/app/home/components/FeaturesSection';
import { PricingSection } from '@/app/home/components/PricingSection';
import { SignupSection } from '@/app/home/components/SignupSection';
import { Footer } from '@/app/home/components/Footer';
import { Navbar } from '@/app/components/Navbar';
import { ImpactCounter } from './components/ImpactCounter';

export default function SnackBoxLanding() {
  const [selectedPlan, setSelectedPlan] = useState('team');

  return (
    <div className="landing-container">
      <Navbar />
      <div className="page-content">
        <HeroSection />
        <ImpactCounter />
        <FeaturesSection />
        <PricingSection selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
        <SignupSection selectedPlan={selectedPlan} />
      </div>
      <Footer />
    </div>
  );
}
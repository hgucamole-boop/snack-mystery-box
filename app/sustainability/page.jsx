'use client';
import { useEffect } from 'react';
import { SustainabilitySection } from './SustainabilitySection';
import { Footer } from '../home/components/Footer';
import { Navbar } from '../components/Navbar';

export default function SustainabilityPage() {
  return (
    <div className="landing-container">
      <Navbar />
      <div className="page-content">
        <SustainabilitySection />
      </div>
      <Footer />
    </div>
  );
}
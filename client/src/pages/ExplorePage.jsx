import React from 'react';
import Hero from '../components/Hero';
import ModelingDataCard from '../components/ModelingDataCard';
import LimitationsHero from '../components/LimitationsHero';
export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Hero />
      <ModelingDataCard />
      <LimitationsHero />
    </div>
  );
}
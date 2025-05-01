
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Statistics from '../components/Statistics';
import Marketplace from '../components/Marketplace';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-agentorium-darkgray relative">

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Statistics />
        <Marketplace />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

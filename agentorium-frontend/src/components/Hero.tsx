
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Simplified background without excessive blur effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-agentorium-darkgray"></div>
        <div className="absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-tr from-agentorium-darkgray via-agentorium-darkgray to-agentorium-blue/5 opacity-10"></div>
      </div>

      {/* Subtle grid pattern overlay with reduced opacity */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMjIiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwem0wIDMwaDMwVjMwaC0zMHYzMHpNMCAzMGgzMFYwSDB2MzB6bTAgMzBoMzBWMzBIMHYzMHoiIGZpbGwtb3BhY2l0eT0iLjAyIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-15"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-agentorium-white">The Future of </span>
              <span className="bg-clip-text text-transparent bg-gradient-button">Web3 AI Agents</span>
            </h1>
            <p className="text-agentorium-lightsilver text-xl mb-8 leading-relaxed">
              Discover, trade, and create AI agents on the decentralized marketplace powered by blockchain. The next generation of intelligence is here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard/marketplace">
                <Button className="bg-gradient-button hover:opacity-90 text-white px-8 py-6 text-lg w-full sm:w-auto">
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="border-agentorium-blue text-agentorium-blue hover:bg-agentorium-blue/10 hover:text-agentorium-white px-8 py-6 text-lg w-full sm:w-auto">
                  Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-card border border-agentorium-silver/20"></div>
                ))}
              </div>
              <span className="ml-4 text-agentorium-silver">
                <span className="font-bold text-agentorium-white">1,200+</span> Creators Onboard
              </span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Blurry decorative elements */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-agentorium-blue rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-32 left-16 w-96 h-96 bg-agentorium-cyan rounded-full opacity-50 blur-2xl"></div>

              {/* Hero image */}
              <div className="relative bg-agentorium-darkgray/80 rounded-2xl p-1 border border-agentorium-silver/10">
                <div className="bg-gradient-card rounded-xl overflow-hidden border border-agentorium-silver/10">
                  <div className="aspect-[4/3] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-agentorium-blue/15 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-agentorium-blue/25 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-agentorium-cyan/80"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg text-agentorium-white font-bold">Agent Core</p>
                        <p className="text-xs text-agentorium-silver mt-1">Web3 Enabled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

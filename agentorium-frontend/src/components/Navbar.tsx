
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-agentorium-darkgray/80 backdrop-blur-md border-b border-agentorium-silver/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-agentorium-white">
                <span className="text-agentorium-blue">Agent</span>orium
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-agentorium-white hover:text-agentorium-cyan transition-colors">
              Marketplace
            </Link>
            <Link to="/about" className="text-agentorium-white hover:text-agentorium-cyan transition-colors">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link to="/dashboard">
              <Button className="bg-gradient-button text-white hover:opacity-90 transition-opacity py-3 px-6 text-l font-semibold tracking-wide">
                Open App
              </Button>
            </Link>
          </div>



          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-agentorium-white hover:text-agentorium-cyan focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} pt-4 pb-2 space-y-2`}>
          <a href="#features" className="block p-2 text-agentorium-white hover:text-agentorium-cyan transition-colors">
            Features
          </a>
          <Link to="/marketplace" className="block p-2 text-agentorium-white hover:text-agentorium-cyan transition-colors">
            Marketplace
          </Link>
          <Link to="/about" className="block p-2 text-agentorium-white hover:text-agentorium-cyan transition-colors">
            About
          </Link>
          <div className="pt-2 flex flex-col space-y-2">
            <Link to="/dashboard">
              <Button className="bg-gradient-button text-white hover:opacity-90 transition-opacity py-3 px-6 text-l font-semibold tracking-wide">
                Open App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

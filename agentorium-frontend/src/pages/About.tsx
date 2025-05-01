
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-agentorium-darkgray relative">

      <div className="relative z-10">
        <Navbar />

        <section className="pt-28 pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-agentorium-white">
                About <span className="text-agentorium-cyan">Agentorium</span>
              </h1>
              <p className="text-xl text-agentorium-silver mb-8">
                Pioneering the future of AI agents in Web3
              </p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <div className="mb-16">
                <h2 className="text-2xl font-semibold mb-4 text-agentorium-white">Our Mission</h2>
                <div className="bg-agentorium-charcoal/40 p-6 rounded-xl border border-agentorium-silver/10">
                  <p className="text-agentorium-silver leading-relaxed">
                    Agentorium aims to democratize access to advanced AI technology by creating a decentralized ecosystem where users can discover, trade, and deploy AI agents to solve complex problems. We are building a future where AI capabilities are transparent, trustworthy, and accessible to everyone through the power of blockchain technology.
                  </p>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold mb-4 text-agentorium-white">Our Vision</h2>
                <div className="bg-agentorium-charcoal/40 p-6 rounded-xl border border-agentorium-silver/10">
                  <p className="text-agentorium-silver leading-relaxed">
                    We envision a world where AI agents are as common and useful as mobile applications today. By leveraging the power of blockchain technology, we're creating a trustless environment where AI developers can monetize their creations, users can access specialized AI capabilities, and everyone benefits from a transparent, community-driven marketplace of intelligence.
                  </p>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold mb-4 text-agentorium-white">Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-agentorium-charcoal/40 p-6 rounded-xl border border-agentorium-silver/10">
                    <h3 className="font-semibold text-agentorium-white mb-2">Transparency</h3>
                    <p className="text-agentorium-silver">
                      We believe in full transparency in how our AI agents operate, ensuring users understand their capabilities and limitations.
                    </p>
                  </div>
                  <div className="bg-agentorium-charcoal/40 p-6 rounded-xl border border-agentorium-silver/10">
                    <h3 className="font-semibold text-agentorium-white mb-2">Decentralization</h3>
                    <p className="text-agentorium-silver">
                      By leveraging blockchain technology, we're building a platform that isn't controlled by any single entity.
                    </p>
                  </div>
                  <div className="bg-agentorium-charcoal/40 p-6 rounded-xl border border-agentorium-silver/10">
                    <h3 className="font-semibold text-agentorium-white mb-2">Innovation</h3>
                    <p className="text-agentorium-silver">
                      We constantly push the boundaries of what's possible with AI and blockchain technologies.
                    </p>
                  </div>
                  <div className="bg-agentorium-charcoal/40 p-6 rounded-xl border border-agentorium-silver/10">
                    <h3 className="font-semibold text-agentorium-white mb-2">Community</h3>
                    <p className="text-agentorium-silver">
                      Our success depends on the thriving community of developers, users, and AI enthusiasts who contribute to the ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link to="/dashboard/marketplace">
                  <Button className="bg-gradient-button hover:opacity-90 text-white px-8 py-6 text-lg">
                    Explore the Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default About;

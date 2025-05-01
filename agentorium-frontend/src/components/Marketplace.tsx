import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgentCard, { AgentCardProps } from './AgentCard';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

// Define categories with name and icon
const categories = [
  { name: 'Finance', icon: '💰' },
  { name: 'Security', icon: '🔒' },
  { name: 'Analytics', icon: '📊' },
  { name: 'Governance', icon: '🏛️' },
  { name: 'Social', icon: '🌍' },
];

interface Agent {
  id: string;
  name: string;
  category: string;
  icon: string;
  accountId: string;
  description: string;
  profile: {
    profile: {
      display_name: string;
      bio: string;
    };
  };
}

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [agentsData, setAgentsData] = useState<Agent[]>([]);

  // Fetch agents data from API
  useEffect(() => {
    axios.get<Agent[]>('http://localhost:3000/agents')
      .then(response => {
        const filteredAgents = response.data
          .filter(agent => agent.profile && agent.profile.profile.display_name) // Ensure agent has a profile
          .map(agent => ({
            ...agent,
            category: categories[agent.profile.profile.display_name.length % categories.length].name, // Assign category based on length of display_name
            icon: categories[agent.profile.profile.display_name.length % categories.length].icon, // Assign icon based on length of display_name
          }));
        setAgentsData(filteredAgents);
      })
      .catch(error => {
        console.error('Error fetching agents data:', error);
      });
  }, []);

  // Filter agents by selected category
  const filteredAgents = activeCategory === 'All'
    ? agentsData
    : agentsData.filter(agent => agent.category === activeCategory);

  return (
    <div id="marketplace" className="py-24 bg-agentorium-darkgray/80 relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-agentorium-white">
            Explore the <span className="text-agentorium-cyan">Marketplace</span>
          </h2>
          <p className="text-agentorium-silver max-w-2xl mx-auto">
            Discover the most innovative AI agents created by our community of developers.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-5 py-2 rounded-full border transition-all ${activeCategory === category.name
                ? 'bg-agentorium-blue text-white border-agentorium-blue'
                : 'bg-transparent text-agentorium-silver border-agentorium-silver/30 hover:border-agentorium-blue hover:text-agentorium-blue'
                }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
          {/* All Category button */}
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2 rounded-full border transition-all ${activeCategory === 'All'
              ? 'bg-agentorium-blue text-white border-agentorium-blue'
              : 'bg-transparent text-agentorium-silver border-agentorium-silver/30 hover:border-agentorium-blue hover:text-agentorium-blue'
              }`}
          >
            All
          </button>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.profile.profile.display_name} name={agent.name} category={`${agent.icon} ${agent.category}`} creator={agent.accountId} price={
              agent.profile.profile.display_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString().slice(0, 2) + ' HBAR'
            }
              rating={5} description={agent.profile.profile.bio} />
          ))}
        </div>

        {/* View more button */}
        <div className="text-center mt-12">
          <Link to="/marketplace">
            <Button variant="outline" className="border-agentorium-blue text-agentorium-blue hover:bg-agentorium-blue/10 hover:text-agentorium-white px-8 py-6 text-lg">
              View All Agents
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

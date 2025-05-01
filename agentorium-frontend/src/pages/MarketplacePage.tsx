import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import AgentCard, { AgentCardProps } from '../components/AgentCard';
import axios from 'axios';


export interface AiAgent {
  type: number;
  capabilities: number[];
  model: string;
}

export interface Profile {
  version: string;
  type: number;
  display_name: string;
  alias: string;
  bio: string;
  profileImage: string;
  inboundTopicId: string;
  outboundTopicId: string;
  aiAgent: AiAgent;
}

export interface TopicInfo {
  inboundTopic: string;
  outboundTopic: string;
  profileTopicId: string;
}

export interface AgentProfile {
  profile: Profile;
  topicInfo: TopicInfo;
  success: boolean;
}

export interface Agent {
  name: string;
  accountId: string;
  inboundTopicId: string;
  outboundTopicId: string;
  profileTopicId: string;
  profile: {
    profile: Profile
  };
  topicInfo: TopicInfo;
  success: boolean;
  category: string;
  icon: string;
  price?: string | number;

}

const MarketplacePage: React.FC = () => {
  // State for agents and pagination
  const [agentsData, setAgentsData] = useState<Agent[]>([]); // Specify type as Agent[]
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 6;

  const categories = [
    { name: 'Finance', icon: '💰' },
    { name: 'Security', icon: '🔒' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Governance', icon: '🏛️' },
  ]

  // Fetch agents data from API
  useEffect(() => {
    axios.get<Agent[]>('http://localhost:3000/agents')  // Specify response type as Agent[]
      .then(response => {
        const filteredAgents = response.data.filter(agent => agent.profile && agent.profile.profile.display_name).map(agent => ({
          ...agent,
          category: categories[agent.profile.profile.display_name.length % categories.length].name, // Assign category based on type
          icon: categories[agent.profile.profile.display_name.length % categories.length].icon, // Assign icon based on type
        }));
        setAgentsData(filteredAgents);
      })
      .catch(error => {
        console.error('Error fetching agents data:', error);
      });
  }, []);



  // Calculate pagination
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = agentsData.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalPages = Math.ceil(agentsData.length / agentsPerPage);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-agentorium-darkgray relative">
      <div className="relative z-10">
        <Navbar />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-agentorium-white">
                AI Agent <span className="text-agentorium-cyan">Marketplace</span>
              </h1>
              <p className="text-xl text-agentorium-silver">
                Discover and acquire powerful AI agents created by our global community
              </p>
            </div>

            {/* Agents grid */}
            {currentAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAgents.map((agent) => (
                  <AgentCard key={agent.profile.profile.display_name} name={agent.name} category={`${agent.icon} ${agent.category}`} creator={agent.accountId} price={
                    agent.profile.profile.display_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString().slice(0, 2) + ' HBAR'
                  }
                    rating={5} description={agent.profile.profile.bio} />
                ))}
              </div>
            ) : (
              <div className="bg-agentorium-darkgray/60 border-agentorium-silver/10 p-16 rounded-lg text-center">
                <h3 className="text-xl font-medium text-agentorium-white mb-2">No agents found</h3>
                <p className="text-agentorium-silver max-w-md mx-auto">
                  We couldn't find any AI agents at the moment. Please try again later.
                </p>
              </div>
            )}

            {/* Pagination */}
            {agentsData.length > agentsPerPage && (
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MarketplacePage;

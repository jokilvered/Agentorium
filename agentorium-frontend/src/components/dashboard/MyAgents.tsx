import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, ChevronDown } from 'lucide-react';
import AgentCard from './AgentCard';
import CreateAgentForm from './CreateAgentForm';
import { TooltipProvider } from '@/components/ui/tooltip';
import axios from 'axios';
import { Agent } from '@/pages/MarketplacePage';
import { toast } from 'sonner';
import { categories } from '@/components/dashboard/Marketplace'; // Import categories from the marketplace
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MyAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortOption, setSortOption] = useState('newest');
  const [agentsData, setAgentsData] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 6;
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    axios.get<Agent[]>('http://localhost:3000/agents')
      .then(response => {
        const agents = response.data.map(agent => ({
          ...agent,
          category: categories[agent.profile.profile.display_name.length % categories.length].name,
          icon: categories[agent.profile.profile.display_name.length % categories.length].icon,
          price: agent.profile.profile.display_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString().slice(0, 2) + ' HBAR'
        }));
        setAgentsData(agents);
        setFilteredAgents(agents);
      })
      .catch(error => {
        console.error('Error fetching agents data:', error);
      });
  }, []);

  useEffect(() => {
    let result = [...agentsData];

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(search) ||
        agent.profile.profile.display_name.toLowerCase().includes(search) ||
        agent.profile.profile.bio.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter(agent => agent.category === selectedCategory);
    }

    setFilteredAgents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, priceRange, sortOption, agentsData]);

  // Pagination logic
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-agentorium-silver" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-agentorium-charcoal border-agentorium-silver/10"
            />
          </div>
          {/* Button to open Create Agent dialog */}
          <Button onClick={() => setShowCreateDialog(true)}>
            <span className="mr-2">Create Agent</span>
            <span className="h-4 w-4">+</span>
          </Button>
        </div>

        {/* Display filtered agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAgents.length > 0 ? (
            currentAgents.map(agent => (
              <AgentCard
                key={agent.profile.profile.display_name}
                name={agent.profile.profile.display_name}
                price={agent.price.toString()}
                accountId={agent.accountId}
                royaltyPercent={0.25}
                type={agent.category}

                onClick={() => toast(`Selected agent: ${agent.profile.profile.display_name}`)} />
            ))
          ) : (
            <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
              <CardContent className="p-16 text-center text-agentorium-white">
                <Search className="h-12 w-12 text-agentorium-silver/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No agents found</h3>
                <p className="text-agentorium-silver max-w-md mx-auto">
                  We couldn't find any AI agents matching your search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {filteredAgents.length > agentsPerPage && (
          <Pagination className="mt-8">
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

        {/* Create Agent Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-lg bg-agentorium-darkgray text-agentorium-white border-agentorium-silver/10">
            <DialogHeader>
              <DialogTitle>Create New AI Agent</DialogTitle>
              <DialogDescription className="text-agentorium-silver">
                Create a new AI agent to perform tasks or list in the marketplace.
              </DialogDescription>
            </DialogHeader>
            <CreateAgentForm onClose={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default MyAgents;

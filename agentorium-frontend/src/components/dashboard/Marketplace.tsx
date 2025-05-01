import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, ChevronDown } from 'lucide-react';
import MarketplaceAgentCard from './MarketplaceAgentCard';
import axios from 'axios';
import BuyAgentModal from './BuyAgentModal';
import { toast } from 'sonner';

// Categories with icons
export const categories = [
  { name: 'Finance', icon: '💰' },
  { name: 'Security', icon: '🔒' },
  { name: 'Analytics', icon: '📊' },
  { name: 'Governance', icon: '🏛️' },
];

// Define types for the agents (you can refine it as per your API response)
export interface Agent {
  id: string;
  name: string;
  profile: {
    profile: {
      display_name: string;
      bio: string;
    };
  };
  accountId: string;
  price: string;
  category: string;
  icon: string;
}

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortOption, setSortOption] = useState('newest');
  const [agentsData, setAgentsData] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agentsData);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 6;
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch agents data from API
  useEffect(() => {
    axios.get<Agent[]>('http://localhost:3000/agents')
      .then(response => {
        const filteredAgents = response.data.map(agent => ({
          ...agent,
          category: categories[agent.profile.profile.display_name.length % categories.length].name, // Assign category based on display_name length
          icon: categories[agent.profile.profile.display_name.length % categories.length].icon, // Assign icon based on display_name length
          price: agent.profile.profile.display_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString().slice(0, 2) + ' HBAR' // Example price calculation
        }));
        setAgentsData(filteredAgents);
        setFilteredAgents(filteredAgents);
      })
      .catch(error => {
        console.error('Error fetching agents data:', error);
      });
  }, []);

  // Filter and sort agents based on search term, category, price range, and sort option
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

    // Filter by price range
    result = result.filter(agent =>
      parseFloat(agent.price.split(' ')[0]) >= priceRange.min && parseFloat(agent.price.split(' ')[0]) <= priceRange.max
    );

    // Sort agents based on selected sort option
    result = result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.profile.profile.display_name).getTime() - new Date(a.profile.profile.display_name).getTime();
        case 'oldest':
          return new Date(a.profile.profile.display_name).getTime() - new Date(b.profile.profile.display_name).getTime();
        case 'price_high':
          return parseFloat(b.price.split(' ')[0]) - parseFloat(a.price.split(' ')[0]);
        case 'price_low':
          return parseFloat(a.price.split(' ')[0]) - parseFloat(b.price.split(' ')[0]);
        default:
          return 0;
      }
    });

    setFilteredAgents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, priceRange, sortOption, agentsData]);

  // Pagination logic
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

  // Handle buying an agent
  const handleBuyClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowBuyDialog(true);
  };

  // Handle completing purchase
  const handleCompletePurchase = () => {
    toast.success(`Successfully purchased ${selectedAgent?.name}!`, {
      description: "The agent has been added to your collection."
    });
    setShowBuyDialog(false);
  };

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
        <Button
          variant="outline"
          className="gap-2 bg-agentorium-charcoal border-agentorium-silver/10"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-agentorium-charcoal border border-agentorium-silver/10 rounded-md text-sm text-agentorium-white px-3 h-10 focus:outline-none focus:border-agentorium-blue/50 focus:ring-1 focus:ring-agentorium-blue/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Extended filter options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-agentorium-charcoal/50 rounded-md border border-agentorium-silver/10">
          {/* Category Filter */}
          <div>
            <label className="text-sm text-agentorium-silver mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${selectedCategory === category.name
                    ? 'bg-agentorium-blue text-white border-agentorium-blue'
                    : 'bg-transparent text-agentorium-silver border-agentorium-silver/30 hover:border-agentorium-blue hover:text-agentorium-blue'
                    }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
              {/* All Category Button */}
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${selectedCategory === 'All Categories'
                  ? 'bg-agentorium-blue text-white border-agentorium-blue'
                  : 'bg-transparent text-agentorium-silver border-agentorium-silver/30 hover:border-agentorium-blue hover:text-agentorium-blue'
                  }`}
              >
                All Categories
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-sm text-agentorium-silver mb-2 block">Price Range</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                className="w-24 bg-agentorium-charcoal border-agentorium-silver/10"
              />
              <span className="text-agentorium-silver">to</span>
              <Input
                type="number"
                max={50000}
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                className="w-24 bg-agentorium-charcoal border-agentorium-silver/10"
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              className="border-agentorium-silver/20 hover:bg-agentorium-blue/10 hover:text-agentorium-blue"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setPriceRange({ min: 0, max: 50000 });
                setSortOption('newest');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Display filtered agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAgents.length > 0 ? (
          currentAgents.map(agent => (
            <MarketplaceAgentCard
              key={agent.id}
              agent={{
                category: agent.category,
                name: agent.name,
                creator: agent.accountId,
                price: parseFloat(agent.price.split(' ')[0]),
                creatorId: agent.accountId,
                description: agent.profile.profile.bio,
                rating: 5,
              }}
              onBuyClick={() => handleBuyClick(agent)}
            />
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

      {/* Buy agent modal */}
      <BuyAgentModal
        isOpen={showBuyDialog}
        onClose={() => setShowBuyDialog(false)}
        agent={{
          name: selectedAgent?.name || '',
          price: parseFloat(selectedAgent?.price.split(' ')[0]) || 0,
          creator: selectedAgent?.accountId || '',
          description: selectedAgent?.profile.profile.bio || '',
          rating: 5,
          creatorId: selectedAgent?.accountId || '',
          status: "available",
          category: selectedAgent?.category || '',
        }}
        onCompletePurchase={handleCompletePurchase}
      />
    </div>
  );
};

export default Marketplace;

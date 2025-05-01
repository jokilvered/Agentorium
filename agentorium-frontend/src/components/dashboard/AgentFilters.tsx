
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentFiltersProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const AgentFilters = ({ 
  filterStatus, 
  setFilterStatus, 
  searchTerm, 
  setSearchTerm,
  sortOption,
  setSortOption
}: AgentFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-between mb-4">
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filterStatus === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus('all')}
          className={filterStatus !== 'all' ? "bg-agentorium-charcoal hover:bg-agentorium-charcoal/80" : ""}
        >
          All Agents
        </Button>
        <Button 
          variant={filterStatus === 'active' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus('active')}
          className={filterStatus !== 'active' ? "bg-agentorium-charcoal hover:bg-agentorium-charcoal/80" : ""}
        >
          Active
        </Button>
        <Button 
          variant={filterStatus === 'listed' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus('listed')}
          className={filterStatus !== 'listed' ? "bg-agentorium-charcoal hover:bg-agentorium-charcoal/80" : ""}
        >
          Listed
        </Button>
        <Button 
          variant={filterStatus === 'idle' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus('idle')}
          className={filterStatus !== 'idle' ? "bg-agentorium-charcoal hover:bg-agentorium-charcoal/80" : ""}
        >
          Idle
        </Button>
        <Button 
          variant={filterStatus === 'sold' ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus('sold')}
          className={filterStatus !== 'sold' ? "bg-agentorium-charcoal hover:bg-agentorium-charcoal/80" : ""}
        >
          Sold
        </Button>
      </div>
      
      <div className="flex gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-agentorium-silver" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agents..."
            className="pl-8 pr-3 py-2 bg-agentorium-charcoal border border-agentorium-silver/10 rounded-md text-sm text-agentorium-white placeholder:text-agentorium-silver/50 focus:outline-none focus:border-agentorium-blue/50 focus:ring-1 focus:ring-agentorium-blue/50"
          />
        </div>
        
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-agentorium-charcoal border border-agentorium-silver/10 rounded-md text-sm text-agentorium-white px-3 py-2 focus:outline-none focus:border-agentorium-blue/50 focus:ring-1 focus:ring-agentorium-blue/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
          <option value="uses_high">Most Used</option>
        </select>
      </div>
    </div>
  );
};

export default AgentFilters;

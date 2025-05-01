
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

export interface AgentData {
  name: string;
  description: string;
  price: number;
  creator: string;
  creatorId: string;
  category: string;
  rating: number;
  status?: 'available' | 'sold' | 'pending';
}

interface MarketplaceAgentCardProps {
  agent: AgentData;
  onBuyClick: () => void;
}

const MarketplaceAgentCard = ({ agent, onBuyClick }: MarketplaceAgentCardProps) => {
  // Generate rating stars
  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(agent.rating);
    const hasHalfStar = agent.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-agentorium-cyan" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-agentorium-cyan" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-star-${agent.name}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="rgba(156, 163, 175, 0.3)" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-star-${agent.name})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-agentorium-silver/30" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    
    return stars;
  };

  // Check if agent is available for purchase
  const isAvailable = !agent.status || agent.status === 'available';

  return (
    <Card className={`h-full glassmorphism rounded-xl overflow-hidden transition-all duration-300 hover:border-agentorium-blue/30 border border-agentorium-silver/5 bg-agentorium-darkgray/60 relative ${!isAvailable ? 'opacity-70' : ''}`}>
      {agent.status === 'sold' && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-bl-md font-bold">
          SOLD
        </div>
      )}
      
      {agent.status === 'pending' && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-bl-md font-bold">
          PENDING
        </div>
      )}
      
      <CardContent className="p-5">
        <div className="flex flex-col h-full">
          {/* Card header with agent info */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded-md bg-agentorium-blue/15 text-agentorium-blue mb-2">
                {agent.category}
              </span>
              <h3 className="text-xl font-bold text-agentorium-white group-hover:text-agentorium-blue transition-colors">
                {agent.name}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={`https://cdn-icons-png.flaticon.com/512/13298/13298257.png`}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Agent description */}
          <p className="text-agentorium-silver text-sm mb-4 line-clamp-2">
            {agent.description}
          </p>
          
          {/* Creator and rating */}
          <div className="flex items-center justify-between mb-4 mt-auto">
            <div className="flex items-center text-xs text-agentorium-lightsilver">
              <span>By {agent.creator}</span>
            </div>
            <div className="flex">
              {renderRatingStars()}
            </div>
          </div>
          
          {/* Price and action buttons */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-agentorium-silver/10">
            <div>
              <span className="text-xs text-agentorium-silver">Price</span>
              <div className="text-lg font-bold text-agentorium-white">{agent.price.toLocaleString()} HBAR</div>
            </div>
            <Button 
              onClick={onBuyClick} 
              className="bg-agentorium-blue hover:bg-agentorium-blue/90 text-white text-sm px-4"
              disabled={!isAvailable}
            >
              <Tag className="h-4 w-4 mr-1" />
              {isAvailable ? 'Buy Now' : 'Sold Out'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceAgentCard;

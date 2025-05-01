
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export interface AgentCardProps {
  name: string;
  description: string;
  price: string;
  creator: string;
  category: string;
  rating: number;
}

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  price,
  creator,
  category,
  rating
}) => {
  const ratingStars = Array(5).fill(0).map((_, i) => (
    <svg
      key={i}
      className={`w-4 h-4 ${i < rating ? 'text-agentorium-cyan' : 'text-agentorium-silver/30'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  ));

  return (
    <div className="group relative glassmorphism rounded-xl overflow-hidden transition-all duration-300 hover:border-agentorium-blue/30 border border-agentorium-silver/5">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-2 py-1 text-xs rounded-md bg-agentorium-blue/15 text-agentorium-blue mb-2">
              {category}
            </span>
            <h3 className="text-xl font-bold text-agentorium-white group-hover:text-agentorium-blue transition-colors">
              {name}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-agentorium-blue/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-agentorium-cyan/20"></div>
          </div>
        </div>

        <p className="text-agentorium-silver text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-xs text-agentorium-lightsilver">
            <span>By {creator}</span>
          </div>
          <div className="flex">
            {ratingStars}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-agentorium-silver">Price</span>
            <div className="text-lg font-bold text-agentorium-white">{price}</div>
          </div>
          <Link to={`https://moonscape.tech/openconvai/agents/${creator}`} target='_blank'>
            <Button className="bg-agentorium-blue hover:bg-agentorium-blue/90 text-white text-sm px-4">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;

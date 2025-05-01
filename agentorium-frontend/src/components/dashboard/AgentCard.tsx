import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Check, Tag, Edit, BarChart, ShoppingCart, X, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import ListAgentModal from './ListAgentModal';
import AgentCardChatHint from './AgentCardChatHint';
import { Link } from 'react-router-dom';

export interface AgentCardProps {
  name: string;
  type: string;
  price: string;
  royaltyPercent: number;
  accountId: string;
  onClick?: () => void;  // Added onClick prop
}

const AgentStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: { icon: Check, className: 'bg-green-500/20 text-green-500' },
    listed: { icon: Tag, className: 'bg-agentorium-blue/20 text-agentorium-blue' },
    idle: { icon: Clock, className: 'bg-agentorium-silver/20 text-agentorium-silver' },
    sold: { icon: X, className: 'bg-red-500/20 text-red-500' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;
  const StatusIcon = config.icon;

  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <StatusIcon size={12} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

const AgentCard = ({ name, type, price, royaltyPercent, onClick, accountId }: AgentCardProps) => {
  const [showListModal, setShowListModal] = useState(false);

  const handleSellAgent = () => {
    setShowListModal(true);
  };

  const handleModifyAgent = () => {
    toast.info("Agent modification coming soon!", {
      description: "This feature is currently under development."
    });
  };

  const handleViewPerformance = () => {
    toast.info("Performance analytics coming soon!", {
      description: "This feature is currently under development."
    });
  };

  const handleListComplete = () => {
    setShowListModal(false);
    toast.success(`${name} has been listed on the marketplace!`, {
      description: "Your agent is now available for purchase."
    });
  };

  const handleUnlistAgent = () => {
    toast.success(`${name} has been unlisted`, {
      description: "Your agent has been removed from the marketplace."
    });
  };

  const handleChatWithAgent = () => {
    // Call the onClick prop passed from parent if it exists
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <Card className="h-full bg-agentorium-darkgray/60 border-agentorium-silver/10 transition-all duration-300 hover:border-agentorium-blue/30 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col h-full">
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/13298/13298257.png"
                    alt={name}
                    className="h-12 w-12 rounded-md object-cover border border-agentorium-silver/10"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    <AgentStatusBadge status={status} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-agentorium-white">{name}</h3>
                  <p className="text-xs text-agentorium-silver">{type}</p>
                </div>
              </div>
              {status !== 'sold' && (
                <div className="text-right">
                  <p className="text-xs text-agentorium-silver">Price</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p className="text-agentorium-white font-bold cursor-help">{price.toLocaleString()}</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto bg-agentorium-charcoal border-agentorium-silver/10 text-agentorium-white">
                      <div className="text-xs">
                        <p className="mb-1">Token price: {price.toLocaleString()} AGNT</p>
                        <p>Creator royalty: {royaltyPercent}%</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              )}
            </div>

            {/* Agent Performance */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <div>
                <p className="text-xs text-agentorium-silver">Royalty</p>
                <p className="text-agentorium-white">{royaltyPercent}%</p>
              </div>
            </div>

            {/* Chat button (for active agents only) */}
            {status === 'active' && (
              <Button
                className="w-full mb-3 bg-agentorium-cyan hover:bg-agentorium-cyan/90 text-agentorium-darkgray font-medium"
                onClick={handleChatWithAgent}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with AI Agent
              </Button>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto pt-3 border-t border-agentorium-silver/10">
              <Link
                to={`https://moonscape.tech/openconvai/agents/${accountId}`}
                target='_blank'
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-agentorium-silver/20 hover:bg-agentorium-blue/10 hover:text-agentorium-blue"
                >
                  Chat with AI Agent
                </Button>
              </Link>
            </div>

          </div>
        </CardContent>
      </Card >

    </>
  );
};

export default AgentCard;

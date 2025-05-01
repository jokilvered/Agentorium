
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface AgentCardChatHintProps {
  status: string;
  onClick: () => void;
}

const AgentCardChatHint: React.FC<AgentCardChatHintProps> = ({ status, onClick }) => {
  if (status !== 'active') {
    return null;
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="absolute top-0 right-0 mt-2 mr-2 bg-agentorium-blue/20 rounded-full p-1 cursor-pointer hover:bg-agentorium-blue/40 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <MessageSquare className="h-4 w-4 text-agentorium-cyan" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Chat with this agent
      </TooltipContent>
    </Tooltip>
  );
};

export default AgentCardChatHint;

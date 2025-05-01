
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickReplyButtonsProps {
  onSelectReply: (reply: string) => void;
  agentType: string;
}

const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({ onSelectReply, agentType }) => {
  // Generate contextual quick replies based on agent type
  const getQuickReplies = (): string[] => {
    const commonReplies = ["Hello", "Thank you", "Help"];
    
    switch (agentType.toLowerCase()) {
      case 'assistant':
        return [...commonReplies, "Schedule a meeting", "Set a reminder"];
      case 'analyzer':
        return [...commonReplies, "Analyze this data", "Generate insights"];
      case 'helper':
        return [...commonReplies, "How does this work?", "What can you do?"];
      case 'developer':
        return [...commonReplies, "Debug my code", "Generate a function"];
      case 'finance':
        return [...commonReplies, "Market analysis", "Portfolio suggestions"];
      default:
        return [...commonReplies, "What can you do?", "Tell me more"];
    }
  };

  const quickReplies = getQuickReplies();

  return (
    <div className="px-3 py-2 flex flex-wrap gap-2 border-t border-agentorium-silver/10">
      {quickReplies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="bg-agentorium-charcoal/50 border-agentorium-silver/20 text-agentorium-silver hover:text-agentorium-white"
          onClick={() => onSelectReply(reply)}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplyButtons;

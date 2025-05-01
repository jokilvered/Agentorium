import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import AgentChat from './AgentChat';

// Mock data for agents with corrected types (should be replaced with actual data fetch)
const mockAgents = [
  {
    id: 1,
    name: 'SmartBot #121',
    status: 'active' as const,
    type: 'Assistant',
    price: 10000,
    royaltyPercent: 2.5,
    uses: 342,
    created: '2025-03-15',
    image: 'https://placehold.co/64x64'
  },
  {
    id: 2,
    name: 'DataWhiz #78',
    status: 'listed' as const,
    type: 'Analyzer',
    price: 15000,
    royaltyPercent: 3.0,
    uses: 157,
    created: '2025-03-22',
    image: 'https://placehold.co/64x64'
  },
  {
    id: 3,
    name: 'AIHelper #56',
    status: 'idle' as const,
    type: 'Helper',
    price: 7500,
    royaltyPercent: 2.0,
    uses: 89,
    created: '2025-04-01',
    image: 'https://placehold.co/64x64'
  },
  {
    id: 4,
    name: 'AnalyticsGuru #45',
    status: 'active' as const,
    type: 'Analyzer',
    price: 12500,
    royaltyPercent: 2.5,
    uses: 231,
    created: '2025-04-10',
    image: 'https://placehold.co/64x64'
  },
  {
    id: 5,
    name: 'CodeMaster #34',
    status: 'idle' as const,
    type: 'Developer',
    price: 20000,
    royaltyPercent: 3.5,
    uses: 56,
    created: '2025-04-15',
    image: 'https://placehold.co/64x64'
  },
  {
    id: 6,
    name: 'TradeBot #99',
    status: 'sold' as const,
    type: 'Finance',
    price: 18000,
    royaltyPercent: 3.0,
    uses: 412,
    created: '2025-02-10',
    image: 'https://placehold.co/64x64'
  },
];

const AgentChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<typeof mockAgents[0] | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch agent data based on ID (mocked for now)
      const agentId = parseInt(id);
      const foundAgent = mockAgents.find(a => a.id === agentId);
      
      if (foundAgent) {
        setAgent(foundAgent);
      } else {
        // Agent not found, redirect back
        navigate('/dashboard/agents');
      }
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/dashboard/agents');
  };

  const handleExportChat = () => {
    // This would be replaced with actual export functionality
    alert('Chat history export functionality would be implemented here');
  };

  if (!agent) {
    return (
      <div className="p-6 text-center">
        <p className="text-agentorium-silver">Loading agent data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-agentorium-white">Chat with {agent.name}</h1>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleExportChat}>
          <Download className="h-4 w-4 mr-2" />
          Export Chat
        </Button>
      </div>
      
      <div className="h-[calc(100vh-180px)]">
        <AgentChat
          agentId={agent.id}
          agentName={agent.name}
          agentType={agent.type}
          agentImage={agent.image}
        />
      </div>
    </div>
  );
};

export default AgentChatPage;

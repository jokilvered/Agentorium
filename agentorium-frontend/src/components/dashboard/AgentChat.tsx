
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, MicOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';
import ChatTypingIndicator from './ChatTypingIndicator';
import QuickReplyButtons from './QuickReplyButtons';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isProcessing?: boolean;
  formattedContent?: React.ReactNode;
}

interface AgentChatProps {
  agentId: number;
  agentName: string;
  agentType: string;
  agentImage?: string;
}

const AgentChat: React.FC<AgentChatProps> = ({
  agentId,
  agentName,
  agentType,
  agentImage = 'https://placehold.co/100x100',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Simulate initial greeting message from the agent
  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial-message',
      content: `Hello! I'm ${agentName}, your ${agentType.toLowerCase()} AI assistant. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [agentName, agentType]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Simulate AI response
  const simulateAgentResponse = (userMessage: string) => {
    // First, add a "typing" indicator
    setIsTyping(true);
    
    // Simulate response delay (1-3 seconds)
    const responseDelay = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      // Generate a mock response based on user input
      let responseText = '';
      
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        responseText = `Hello! How can I assist you with ${agentType.toLowerCase()} tasks today?`;
      } else if (userMessage.toLowerCase().includes('help')) {
        responseText = "I can help you with various tasks. Simply tell me what you need assistance with, and I'll do my best to help you!";
      } else if (userMessage.toLowerCase().includes('thank')) {
        responseText = "You're welcome! Feel free to reach out if you need anything else.";
      } else if (userMessage.toLowerCase().includes('feature') || userMessage.toLowerCase().includes('do')) {
        responseText = `As a ${agentType} AI, I can assist with tasks related to data analysis, insights, and recommendations based on your queries. I can also format responses with **bold text**, *italic text*, and [links](https://example.com) when needed.`;
      } else if (userMessage.length < 10) {
        responseText = "Could you please provide more details so I can better assist you?";
      } else {
        responseText = `I've analyzed your request about "${userMessage.substring(0, 20)}...". As a ${agentType} AI, I suggest exploring this further by breaking down the problem into smaller components. Would you like me to help with that?`;
      }
      
      setIsTyping(false);
      
      // Add agent response to messages
      const newAgentMessage: Message = {
        id: `agent-${Date.now()}`,
        content: responseText,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, newAgentMessage]);
    }, responseDelay);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!input.trim()) return;
    
    // Create a new user message
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Clear input
    setInput('');
    
    // Simulate agent response
    simulateAgentResponse(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    // This would be replaced with actual speech recognition code
    if (!isRecording) {
      setIsRecording(true);
      toast.info("Voice recording started. Speak now...");
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        const recognizedText = "This is simulated voice input from the speech recognition API.";
        setInput(recognizedText);
        toast.success("Voice recording completed");
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info("Voice recording canceled");
    }
  };
  
  const handleQuickReply = (reply: string) => {
    setInput(reply);
    // Optional: Automatically send the quick reply
    // setTimeout(() => handleSubmit(), 100);
  };

  return (
    <div className="flex flex-col h-full bg-agentorium-darkgray rounded-lg border border-agentorium-silver/10">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-agentorium-silver/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-agentorium-white">{agentName}</h3>
          <p className="text-xs text-agentorium-silver">{agentType}</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <ChatTypingIndicator />}
        </div>
        
        {/* Add some space at the bottom for better UX */}
        <div className="h-4"></div>
      </ScrollArea>
      
      {/* Quick reply buttons */}
      <QuickReplyButtons 
        onSelectReply={handleQuickReply} 
        agentType={agentType} 
      />
      
      {/* Chat input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-agentorium-silver/10">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-10 max-h-32 resize-none pr-10"
              rows={1}
            />
          </div>
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "text-red-500" : "text-agentorium-silver"}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button 
            type="submit" 
            variant="default"
            className="bg-agentorium-blue hover:bg-agentorium-blue/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentChat;

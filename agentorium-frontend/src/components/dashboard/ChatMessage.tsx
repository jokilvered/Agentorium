
import React from 'react';
import { Message } from './AgentChat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

// Function to format text with markdown-like syntax
const formatMessageContent = (content: string): React.ReactNode => {
  // Handle bold text: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  
  // Handle italic text: *text*
  const italicRegex = /\*([^*]*)\*/g;
  
  // Handle links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Apply formatting
  let formattedContent = content
    .split(boldRegex)
    .map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
    .flatMap((part, i) => {
      if (typeof part === 'string') {
        const italicParts = part.split(italicRegex);
        return italicParts.map((italicPart, j) => j % 2 === 1 ? <em key={`${i}-${j}`}>{italicPart}</em> : italicPart);
      }
      return part;
    });

  // Convert array to React elements
  const result = [];
  let key = 0;
  
  for (const part of formattedContent) {
    if (typeof part === 'string') {
      // Process links in text parts
      const segments = part.split(linkRegex);
      
      for (let i = 0; i < segments.length; i++) {
        if (i % 3 === 0) {
          // Plain text segments
          if (segments[i]) {
            result.push(<span key={key++}>{segments[i]}</span>);
          }
        } else if (i % 3 === 1) {
          // Link text
          const linkText = segments[i];
          const linkUrl = segments[i + 1];
          result.push(
            <a 
              key={key++} 
              href={linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-agentorium-cyan hover:underline"
            >
              {linkText}
            </a>
          );
        }
      }
    } else {
      // Already processed bold/italic elements
      result.push(React.cloneElement(part, { key: key++ }));
    }
  }
  
  return <>{result}</>;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formattedContent = formatMessageContent(message.content);
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-agentorium-blue text-white rounded-br-none" 
          : "bg-agentorium-charcoal/50 text-white border border-agentorium-silver/10 rounded-bl-none"
      )}>
        {formattedContent}
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-agentorium-white/70" : "text-agentorium-silver"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;


import React from 'react';

const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex mb-4 justify-start">
      <div className="bg-agentorium-charcoal/50 text-white border border-agentorium-silver/10 rounded-lg rounded-bl-none px-4 py-2">
        <div className="flex space-x-1 items-center">
          <div className="h-2 w-2 bg-agentorium-silver/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-agentorium-silver/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="h-2 w-2 bg-agentorium-silver/60 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;

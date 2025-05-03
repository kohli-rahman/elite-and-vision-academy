
import { useEffect } from 'react';
import ChatBot from '@/components/ChatBot';

const ChatBotPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="section-container">
        <div className="text-center mb-12">
          <h1 className="heading-lg mb-4">AI Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about Elite & Vision Academy? Our AI assistant is here to help! 
            Ask about our courses, admission process, or anything else you'd like to know.
          </p>
        </div>
        
        <ChatBot />
      </div>
    </div>
  );
};

export default ChatBotPage;

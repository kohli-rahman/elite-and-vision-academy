
import { useState } from "react";
import { sendMessageToGemini } from "@/api/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant", content: string }[]>([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send to the AI.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: "user", content: prompt }]);
    
    try {
      const result = await sendMessageToGemini(prompt);
      
      if (result) {
        // Add AI response to chat history
        setChatHistory(prev => [...prev, { role: "assistant", content: result }]);
      }
    } catch (err) {
      console.error("Error in chat:", err);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPrompt(""); // Clear input after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="bg-primary/10 py-3 flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat} 
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 h-[300px] overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Ask me anything about Elite & Vision Academy!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-lg ${
                      message.role === "user" 
                        ? "bg-primary/10 ml-auto max-w-[80%] text-right" 
                        : "bg-secondary/10 mr-auto max-w-[80%]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex w-full gap-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="flex-1 resize-none min-h-[60px] max-h-[100px] text-sm"
                disabled={loading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={loading || !prompt.trim()}
                className="self-end h-9"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}

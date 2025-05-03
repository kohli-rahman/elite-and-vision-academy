
import { useState } from "react";
import { sendMessageToGemini } from "@/api/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant", content: string }[]>([]);

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
        setResponse(result);
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
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <MessageCircle className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[400px] overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Ask me anything about Elite & Vision Academy or educational programs!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-primary/10 ml-auto max-w-[80%] text-right" 
                    : "bg-secondary/10 mr-auto max-w-[80%]"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className="flex-1 resize-none"
            rows={2}
            disabled={loading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !prompt.trim()}
            className="self-end"
          >
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

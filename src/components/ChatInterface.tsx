import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchBar } from "./SearchBar";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  initialQuery?: string;
}

export const ChatInterface = ({ initialQuery }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: string }[]>([]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const fileToGenerativePart = async (file: File) => {
    const buffer = await file.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(buffer).toString('base64'),
        mimeType: file.type
      }
    };
  };

  const handleSendMessage = async (query: string, imageFile?: File) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { content: query, isUser: true }]);

      // Add user message to chat history
      const updatedHistory = [...chatHistory, { role: "user", parts: query }];
      setChatHistory(updatedHistory);

      const genAI = new GoogleGenerativeAI("AIzaSyBqvDih8yCI-jhE2HNkbBdMkaKxXIxT3eA");
      const model = genAI.getGenerativeModel({
        model: "gemini-pro"
      });

      // Create a chat instance with history
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      let result;
      if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        result = await model.generateContent([imagePart, query]);
      } else {
        result = await chat.sendMessage(query);
      }

      const response = await result.response;
      const text = response.text();

      // Add assistant response to chat history
      setChatHistory([...updatedHistory, { role: "assistant", parts: text }]);
      setMessages((prev) => [...prev, { content: text, isUser: false }]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      <div className="bg-card rounded-2xl shadow-lg p-6 min-h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="mt-auto">
          <SearchBar onSubmit={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SearchBar } from "./SearchBar";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
  image?: string;
}

interface ChatInterfaceProps {
  initialQuery?: string;
}

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ChatInterface = ({ initialQuery }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = async (query: string, image?: File) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { 
        content: query || "Image analysis request", 
        isUser: true,
        image: image ? URL.createObjectURL(image) : undefined
      }]);

      const genAI = new GoogleGenerativeAI("AIzaSyBqvDih8yCI-jhE2HNkbBdMkaKxXIxT3eA");
      const model = genAI.getGenerativeModel({ model: image ? "gemini-pro-vision" : "gemini-pro" });

      let result;
      if (image) {
        const base64Image = await convertImageToBase64(image);
        result = await model.generateContent([
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: image.type
            }
          },
          query || "Please analyze this image"
        ]);
      } else {
        result = await model.generateContent(query);
      }

      const response = await result.response;
      const text = response.text();

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
              image={message.image}
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
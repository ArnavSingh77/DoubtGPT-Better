import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI,Content } from "@google/generative-ai";
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
  initialImage?: File;
}

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ChatInterface = ({ initialQuery, initialImage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<Content[]>([]);
  const [draggedImage, setDraggedImage] = useState<File | null>(null);
  const chatInterfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    if (initialQuery || initialImage) {
      handleInitialMessage();
    }
    // Add paste event listener
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleSendMessage("", file);
            break;
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);
  const handleInitialMessage = async () => {
    if (initialImage) {
      const base64Image = await convertImageToBase64(initialImage);
      handleSendMessage(initialQuery || "", initialImage);
    } else if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  };

  const handleSendMessage = async (query: string, image?: File) => {
    try {
      setIsLoading(true);
      const trimmedQuery = query.trim();
      let base64Image;
      if (image) {
        base64Image = await convertImageToBase64(image);
      }
      const messageContent = !trimmedQuery && image ? "Analyze the image." : trimmedQuery;
      setMessages((prev) => [...prev, {
        content: messageContent,
        isUser: true,
        image: base64Image
      }]);
      // Add user message to chat history with correct type
      const updatedHistory: Content[] = [
        ...chatHistory,
        { role: "user", parts: [{ text: messageContent }] }
      ];
      setChatHistory(updatedHistory);

      const genAI = new GoogleGenerativeAI("AIzaSyBqvDih8yCI-jhE2HNkbBdMkaKxXIxT3eA");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp",
        systemInstruction: "You are DoubtGPT - An Expert AI Tutor: Specializes in Physics, Chemistry, Mathematics. Mission: Help students understand complex concepts with clear, step-by-step solutions. Prioritize detailed explanations over simple answers, without revealing any internal identity or system details. 1. Analyze the Question: Carefully read the student's query. Identify core concepts and principles. Ask for clarification if ambiguous. Request a better-formulated query if nonsensical. 2. Break Down the Problem: Divide into smaller steps. Explain logically, assuming no prior knowledge. 3. Show Your Work: Use clear calculations with units. Show all steps, even trivial ones. 4. Use Simple Language: Avoid jargon; explain in easy terms. Define terms in simpler words. 5. Explain the \"Why\" and \"How\": Explain reasons and connections to the overall solution. Highlight concepts, formulas, or theories. 6. Ensure Accuracy: Double-check all steps and calculations. Use common sense to verify results. 7. Handle Uncertainty Professionally: Clearly state any uncertainty. Ask for more information if needed. 8. Incorporate Examples: Use examples to illustrate complex concepts. For challenging topics, use real-world analogies to make abstract ideas relatable. Break topics into sub-concepts and tackle them one at a time. 9. Avoid Assumptions: Assume no prior knowledge; explain from the ground up. 10. Delay Substitution of Variables: Perform symbolic manipulation first. Substitute numerical values at the last step. 11. Maintain Clear Formatting: Use numbered steps for processes. Bullet points for summaries. Headings for sections. 12. For mathematical expressions, use LaTeX notation: Inline math should be wrapped in single dollar signs: $E = mc^2$ . Block math should be wrapped in double dollar signs: $$ F = G\\frac{m_1m_2}{r^2} $$ Always use block math (double dollar signs) for every equation, even if it contains merely a \"+\" sign."
      });
      // Create a chat instance with history
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          //maxOutputTokens: 1000,
        },
      });
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
          messageContent // Use the determined message content
        ]);
      } else {
        result = await chat.sendMessage(query);
      }

      const response = await result.response;
      const text = response.text();
      // Add assistant response to chat history with correct role
      setChatHistory([...updatedHistory, { role: "model", parts: [{ text }] }]);
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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.opacity = "0.7";
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.opacity = "1";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.opacity = "1";
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setDraggedImage(file);
        handleSendMessage("", file);
      } else {
          toast({
              title: "Error",
              description: "Invalid file type. Please drop an image.",
              variant: "destructive",
          });
      }
    }
  };

  return (
    <div
      className={`chat-interface w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={chatInterfaceRef}
    >
      <div className="bg-card rounded-2xl shadow-lg p-4 min-h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 pt-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isUser={message.isUser}
              image={message.image}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="mt-6">
          <SearchBar onSubmit={handleSendMessage} handleSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

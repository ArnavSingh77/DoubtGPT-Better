import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  image?: string;
}

export const ChatMessage = ({ content, isUser, image }: ChatMessageProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 group`}>
      <div
        className={`relative max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        }`}
      >
        {image && (
          <div className="mb-3">
            <img 
              src={image} 
              alt="Uploaded content" 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
        {isUser ? (
          <div className="relative">
            {content}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="relative">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              className="prose prose-sm max-w-none prose-pre:bg-secondary/50 prose-pre:text-secondary-foreground"
            >
              {content}
            </ReactMarkdown>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
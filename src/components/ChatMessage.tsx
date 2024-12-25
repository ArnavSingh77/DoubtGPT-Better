import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Copy, Check } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  image?: string;
}

export const ChatMessage = ({ content, isUser, image }: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Content successfully copied to clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Error",
        description: "Failed to copy content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        } relative`}
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
        <div className="flex items-center justify-between">
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              className="prose prose-sm max-w-none prose-pre:bg-secondary/50 prose-pre:text-secondary-foreground whitespace-pre-wrap"
            >
              {content}
            </ReactMarkdown>
          )}
          {!isUser && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 p-1"
                    onClick={handleCopy}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Copy Markdown
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

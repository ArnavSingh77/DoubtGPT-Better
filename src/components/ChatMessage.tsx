import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Components } from "react-markdown";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input:', transcript);
      // Here you would typically send this to your chat handler
    };

    recognition.start();
  };

  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !props.inline ? (
        <pre className="bg-black/10 p-2 rounded">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={components}
        >
          {content}
        </ReactMarkdown>
        
        {isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={startVoiceInput}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  image?: string;
}

export const ChatMessage = ({ content, isUser, image }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
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
          content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className="prose prose-sm max-w-none prose-pre:bg-secondary/50 prose-pre:text-secondary-foreground"
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

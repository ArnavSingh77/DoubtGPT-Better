import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Google Analytics script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-KHMQFKMXQX`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", "G-KHMQFKMXQX");
    };
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
import { Brain, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { SearchBar } from "@/components/SearchBar";
import { FeatureCard } from "@/components/FeatureCard";
import { StatCard } from "@/components/StatCard";

const Index = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [initialImage, setInitialImage] = useState<File | undefined>();

  const handleSearchSubmit = (query: string, image?: File) => {
    setInitialQuery(query);
    setInitialImage(image);
    setIsChatVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/50 to-background">
      <div className="container px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DoubtGPT
          </h1>
          <p className="text-xl text-muted-foreground">
            Your AI-powered learning companion
          </p>
        </div>

        {/* Search/Chat Section */}
        <div className={`transition-all duration-500 ease-in-out ${isChatVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {isChatVisible ? (
            <ChatInterface initialQuery={initialQuery} initialImage={initialImage} />
          ) : null}
        </div>

        <div className={`search-container transition-all duration-500 ease-in-out ${isChatVisible ? 'scale-95 opacity-0 hidden' : 'scale-100 opacity-100'}`}>
          <SearchBar onSubmit={handleSearchSubmit} />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 mt-16">
          <FeatureCard
            icon={Brain}
            title="Smart Solutions"
            description="Get detailed, step-by-step solutions to complex academic problems across various subjects."
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          />
          <FeatureCard
            icon={Clock}
            title="24/7 Availability"
            description="Access educational resources anytime, anywhere, with our always-available platform."
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          />
          <FeatureCard
            icon={CheckCircle}
            title="Verified Content"
            description="Every solution is thoroughly verified for accuracy and clarity by our expert system."
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              value="10K+" 
              label="Questions Solved"
              className="text-primary"
            />
            <StatCard 
              value="10K+" 
              label="Happy Students"
              className="text-accent"
            />
            <StatCard 
              value="20+" 
              label="Subjects Covered"
              className="text-primary"
            />
            <StatCard 
              value="99%" 
              label="Accuracy Rate"
              className="text-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
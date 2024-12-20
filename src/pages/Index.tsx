import { Brain, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ChatInterface } from "./../components/ChatInterface";
import { SearchBar } from "./../components/SearchBar";
import { FeatureCard } from "./../components/FeatureCard";
import { StatCard } from "./../components/StatCard";

const Index = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [initialImage, setInitialImage] = useState<File | undefined>();
  const [initialImage, setInitialImage] = useState<File | undefined>();

  const handleSearchSubmit = (query: string
    , image?: File
    ) => {
    setInitialQuery(query);
    setInitialImage(image);
    setIsChatVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">DoubtGPT</h1>
          <p className="text-xl text-muted-foreground">
            Padhlo chahe kahin se, doubts poocho yahin se.
          </p>
        </div>

        {/* Search/Chat Section with smooth transitions */}
        <div 
          className={`
            transition-all duration-500 ease-in-out transform
            ${isChatVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {isChatVisible ? (
            <ChatInterface initialQuery={initialQuery} initialImage={initialImage} />
            <ChatInterface initialQuery={initialQuery} initialImage={initialImage} />
          ) : null}
        </div>

        <div className={`search-container transition-all duration-500 ease-in-out ${isChatVisible ? 'scale-95 opacity-0 hidden' : 'scale-100 opacity-100'}`}>
          <SearchBar onSubmit={handleSearchSubmit} />
        </div>

        {/* Features Section with hover effects */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 mt-16">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <FeatureCard
              icon={Brain}
              title="Smart Solutions"
              description="Get detailed, step-by-step solutions to complex academic problems across various subjects."
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <FeatureCard
              icon={Clock}
              title="24/7 Availability"
              description="Access educational resources anytime, anywhere, with our always-available platform."
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <FeatureCard
              icon={CheckCircle}
              title="Verified Content"
              description="Every solution is thoroughly verified for accuracy and clarity by our expert team."
            />
          </div>
        </div>

        {/* Stats Section with glass morphism effect */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10K+" label="Questions Solved" />
            <StatCard value="10K+" label="Happy Students" />
            <StatCard value="20+" label="Subjects Covered" />
            <StatCard value="90%" label="Accuracy Rate" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
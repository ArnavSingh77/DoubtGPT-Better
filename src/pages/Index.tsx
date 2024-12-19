import { Brain, Clock, CheckCircle } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { FeatureCard } from "@/components/FeatureCard";
import { StatCard } from "@/components/StatCard";

const recentQueries = [
  "the magnetic field in a give...",
  "consider the reaction unde...",
  "let m denote the number o...",
  "a uniform solid sphere of r...",
  "a particle of mass 1kg is pl...",
];

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">DoubtGPT</h1>
          <p className="text-xl text-muted-foreground">
            One-stop to all your doubts.
          </p>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <SearchBar />
          <div className="recent-queries">
            {recentQueries.map((query, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white/80 hover:bg-white rounded-full text-sm text-muted-foreground transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={Brain}
            title="Smart Solutions"
            description="Provide detailed, step-by-step solutions to complex academic problems across various subjects."
          />
          <FeatureCard
            icon={Clock}
            title="24/7 Availability"
            description="Access educational resources anytime, anywhere, with our always-available platform."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Verified Content"
            description="Every solution is thoroughly verified for accuracy and clarity by our expert team."
          />
        </div>

        {/* Stats */}
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10K+" label="Questions Solved" />
            <StatCard value="10K+" label="Happy Students" />
            <StatCard value="20+" label="Subjects Covered" />
            <StatCard value="99%" label="Accuracy Rate" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
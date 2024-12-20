import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group hover:scale-105 transition-all duration-300 mb-5">
      <div className="feature-card bg-white/10 backdrop-blur-md border border-white/20 hover:border-primary/30 h-48 flex flex-col justify-between">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-primary group-hover:text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className={cn("text-4xl font-bold text-primary mb-2", className)}>{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};
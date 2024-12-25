interface StatCardProps {
  value: string;
  label: string;
  description?: string; // Optional description to show in tooltip
}

export const StatCard = ({ value, label, description }: StatCardProps) => {
  return (
    <div className="stat-card group hover:scale-105 transition-all duration-300">
      <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-5">
        {value}
      </div>
      <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {label}
      </div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
    </div>
  );
};
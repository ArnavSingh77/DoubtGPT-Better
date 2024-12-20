interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="stat-card group hover:scale-105 transition-all duration-300">
      <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-5">
        {value}
      </div>
      <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {label}
      </div>
    </div>
  );
};
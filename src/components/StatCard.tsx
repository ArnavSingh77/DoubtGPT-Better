interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="relative group">
      <div className="stat-card overflow-hidden relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-3">
            {value}
          </div>
          <div className="text-sm font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors duration-300">
            {label}
          </div>
        </div>
      </div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
    </div>
  );
};
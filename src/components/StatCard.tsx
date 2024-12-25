interface StatCardProps {
  value: string;
  label: string;
  description?: string;
}

export const StatCard = ({ value, label, description }: StatCardProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[140px] p-6 rounded-2xl bg-black/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
      <div className="relative z-10 text-center">
        <div className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-purple-400 to-indigo-600 bg-clip-text text-transparent mb-2">
          {value}
        </div>
        <div className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
          {label}
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-indigo-500/0 group-hover:from-purple-500/10 transition-all duration-300" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
    </div>
  );
};
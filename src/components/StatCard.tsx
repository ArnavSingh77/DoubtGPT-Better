interface StatCardProps {
  value: string;
  label: string;
  description?: string; // Optional description to show in tooltip
}

export const StatCard = ({ value, label, description }: StatCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card p-6 border shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col space-y-2">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 -ml-8 -mb-8 bg-accent/10 rounded-full blur-2xl" />
        
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        
        <span className="text-3xl font-bold relative z-10">
          {value}
        </span>
        
        {description && (
          <div 
            className="absolute bottom-2 right-2 group/tooltip cursor-help"
            title={description}
          >
            <svg 
              className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200">
              {description}
              <div className="absolute bottom-0 right-4 w-2 h-2 bg-popover rotate-45 translate-y-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
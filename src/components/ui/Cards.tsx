import React from 'react';
import { cn } from '@/src/lib/utils';
import { Metric } from '@/src/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps extends Metric {
  className?: string;
  isHighPriority?: boolean;
}

export function MetricCard({ label, value, change, trend, accent = 'slate', className, isHighPriority }: MetricCardProps) {
  const accentStyles = {
    blue: 'border-blue-500/20 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5',
    rose: 'border-rose-500/30 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5 ring-1 ring-rose-500/30',
    emerald: 'border-emerald-500/20 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5',
    slate: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50',
  };

  const textAccentStyles = {
    blue: 'text-blue-600 dark:text-blue-400',
    rose: 'text-rose-600 dark:text-rose-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    slate: 'text-slate-500',
  };

  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] shadow-sm dark:shadow-none",
      accentStyles[accent],
      className
    )}>
      <p className={cn("text-[10px] uppercase font-bold mb-1 tracking-wider", textAccentStyles[accent])}>
        {label}
      </p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm",
            trend === 'up' ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10" : "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-400/10"
          )}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      {isHighPriority && (
        <p className="text-[10px] text-rose-600 dark:text-rose-500 font-semibold mt-2 tracking-wide uppercase">Requires attention</p>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Open: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Under Review': 'bg-blue-500/10 text-blue-400 border-blue-500/20 border-blue-500/20',
    Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded text-[10px] font-bold border uppercase tracking-wide",
      styles[status] || styles.Review
    )}>
      {status}
    </span>
  );
}

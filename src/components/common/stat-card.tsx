import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  isMono?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  isMono = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {icon && (
          <div className="text-muted-foreground/80 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div
          className={cn(
            "text-2xl font-bold tracking-tight text-foreground md:text-3xl",
            isMono && "font-mono"
          )}
        >
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              trend.isPositive
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50"
                : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {(description || trend?.label) && (
        <p className="mt-1 text-xs text-muted-foreground leading-normal">
          {description ?? trend?.label}
        </p>
      )}
    </div>
  );
}

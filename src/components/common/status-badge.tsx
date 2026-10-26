import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "destructive"
  | "info"
  | "neutral";

export interface StatusBadgeProps {
  status: string;
  variant?: StatusBadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  variant = "neutral",
  size = "sm",
  dot = false,
  className,
}: StatusBadgeProps) {
  const variantStyles: Record<StatusBadgeVariant, string> = {
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    danger:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    destructive:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    neutral:
      "bg-muted/60 text-muted-foreground border-border dark:bg-muted/40",
  };

  const dotStyles: Record<StatusBadgeVariant, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    destructive: "bg-rose-500",
    info: "bg-blue-500",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide uppercase font-mono",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      <span>{status}</span>
    </span>
  );
}

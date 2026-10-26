import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary";
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  badgeVariant = "secondary",
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-6 border-b border-border/80",
        className
      )}
    >
      <div className="space-y-1">
        {badge && (
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider mb-1",
              badgeVariant === "secondary" &&
                "bg-primary/10 text-primary border border-primary/20",
              badgeVariant === "outline" && "border border-border text-muted-foreground",
              badgeVariant === "default" && "bg-primary text-primary-foreground"
            )}
          >
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          {children}
        </div>
      )}
    </div>
  );
}

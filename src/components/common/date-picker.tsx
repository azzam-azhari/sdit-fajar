"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (dateString: string) => void;
}

export function DatePicker({
  label,
  error,
  helperText,
  value,
  onChange,
  className,
  id,
  disabled,
  ...props
}: DatePickerProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-foreground tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <CalendarIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          id={inputId}
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1.5 text-xs font-mono shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-destructive font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-[11px] text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

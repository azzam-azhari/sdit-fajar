import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-extrabold transition focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-sky-500 text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)] hover:-translate-y-0.5 hover:bg-sky-600",
        secondary:
          "border border-sky-100 bg-white/90 text-sky-700 shadow-[0_10px_25px_rgba(14,165,233,0.1)] hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50",
        ghost: "text-slate-700 hover:bg-sky-50 hover:text-sky-700",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-10 px-4",
        lg: "h-14 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return <Component className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

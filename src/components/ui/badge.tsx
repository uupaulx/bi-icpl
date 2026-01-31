import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Legacy variants (backward compatible)
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",

        // ICP Design System - Filled variants
        blue:
          "border-transparent bg-primary text-primary-foreground",
        green:
          "border-transparent bg-[hsl(var(--success))] text-white",
        red:
          "border-transparent bg-destructive text-destructive-foreground",
        orange:
          "border-transparent bg-[hsl(var(--color-orange-500))] text-white",
        yellow:
          "border-transparent bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]",
        purple:
          "border-transparent bg-[hsl(var(--color-purple-500))] text-white",
        gray:
          "border-transparent bg-muted text-muted-foreground",
        cyan:
          "border-transparent bg-secondary text-secondary-foreground",

        // ICP Design System - Outline variants
        "blue-outline":
          "border-primary text-primary bg-transparent",
        "green-outline":
          "border-[hsl(var(--success))] text-[hsl(var(--success))] bg-transparent",
        "red-outline":
          "border-destructive text-destructive bg-transparent",
        "orange-outline":
          "border-[hsl(var(--color-orange-500))] text-[hsl(var(--color-orange-500))] bg-transparent",
        "yellow-outline":
          "border-[hsl(var(--warning))] text-[hsl(var(--warning))] bg-transparent",
        "purple-outline":
          "border-[hsl(var(--color-purple-500))] text-[hsl(var(--color-purple-500))] bg-transparent",
        "gray-outline":
          "border-muted-foreground/50 text-muted-foreground bg-transparent",
        "cyan-outline":
          "border-secondary text-secondary bg-transparent",

        // ICP Design System - Soft variants (light background)
        "blue-soft":
          "border-transparent bg-[hsl(var(--color-primary-50))] text-primary",
        "green-soft":
          "border-transparent bg-[hsl(var(--color-green-50))] text-[hsl(var(--success))]",
        "red-soft":
          "border-transparent bg-[hsl(var(--color-red-50))] text-destructive",
        "orange-soft":
          "border-transparent bg-[hsl(var(--color-orange-50))] text-[hsl(var(--color-orange-500))]",
        "yellow-soft":
          "border-transparent bg-[hsl(var(--color-yellow-50))] text-[hsl(var(--warning))]",
        "purple-soft":
          "border-transparent bg-[hsl(var(--color-purple-50))] text-[hsl(var(--color-purple-500))]",
        "gray-soft":
          "border-transparent bg-[hsl(var(--color-grey-50))] text-muted-foreground",
        "cyan-soft":
          "border-transparent bg-[hsl(var(--color-cyan-50))] text-secondary",

        // Legacy semantic variants (kept for backward compatibility)
        success:
          "border-transparent bg-[hsl(var(--color-green-50))] text-[hsl(var(--success))]",
        warning:
          "border-transparent bg-[hsl(var(--color-yellow-50))] text-[hsl(var(--warning))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

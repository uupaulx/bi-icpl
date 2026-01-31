import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary variants (ICP Blue - Pantone 286 C)
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        "primary-outline":
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",

        // Secondary variants (Cyan)
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
        "secondary-outline":
          "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground",

        // Tertiary (subtle)
        tertiary:
          "bg-muted text-foreground hover:bg-muted/80 active:bg-muted/70",

        // Danger/Destructive (Red)
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        "danger-outline":
          "border-2 border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground",
        "danger-tertiary":
          "text-destructive hover:bg-destructive/10 active:bg-destructive/20",

        // Success (Green)
        success:
          "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90 active:bg-[hsl(var(--success))]/80",
        "success-outline":
          "border-2 border-[hsl(var(--success))] text-[hsl(var(--success))] bg-transparent hover:bg-[hsl(var(--success))] hover:text-white",
        "success-tertiary":
          "text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/10 active:bg-[hsl(var(--success))]/20",

        // Gray
        gray: "bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/70",
        "gray-outline":
          "border-2 border-muted-foreground/30 text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground",
        "gray-tertiary":
          "text-muted-foreground hover:bg-muted/50 active:bg-muted/70",

        // Outline (legacy - maps to primary-outline)
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        // Ghost & Link
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // Dark (for light backgrounds)
        dark: "bg-foreground text-background hover:bg-foreground/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[8px] px-3 text-xs",
        lg: "h-11 rounded-[10px] px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-[8px]",
        "icon-lg": "h-12 w-12 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

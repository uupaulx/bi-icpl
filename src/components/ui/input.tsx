import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-[10px] border border-input bg-background text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-2 py-1 text-xs rounded-[8px]",
        lg: "h-12 px-4 py-3 text-base",
      },
      error: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      inputSize: "default",
      error: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(inputVariants({ inputSize, error, className }))}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "min-h-11 w-full rounded-xl border border-brand-espresso/10 bg-white px-4 text-sm",
          "placeholder:text-brand-espresso/40 shadow-sm",
          "focus:border-brand-clay focus:outline-none focus:ring-2 focus:ring-brand-clay/25",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

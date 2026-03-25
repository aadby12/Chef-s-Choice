import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full resize-y rounded-xl border border-brand-espresso/10 bg-white px-4 py-3 text-sm",
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

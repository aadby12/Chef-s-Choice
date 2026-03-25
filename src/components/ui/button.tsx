import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta " +
    "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  const sizes = {
    sm: "min-h-10 px-4 text-sm",
    md: "min-h-11 px-6 text-sm",
    lg: "min-h-12 px-8 text-base",
  };
  const variants = {
    primary:
      "bg-brand-espresso text-brand-cream shadow-soft hover:shadow-lift hover:bg-brand-charcoal border border-transparent",
    secondary: "bg-brand-clay text-brand-cream hover:bg-brand-terracotta border border-transparent",
    ghost: "bg-transparent text-brand-espresso hover:bg-brand-sand/40 border border-transparent",
    outline:
      "border border-brand-espresso/15 bg-brand-cream text-brand-espresso hover:bg-white hover:border-brand-espresso/25",
  };
  return <button ref={ref} className={cn(base, sizes[size], variants[variant], className)} {...props} />;
});

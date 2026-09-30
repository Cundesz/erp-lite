import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-stone-100 placeholder:text-faint shadow-sm transition-colors focus-visible:outline-none focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/15 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-stone-100 shadow-sm focus-visible:outline-none focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/15 [&>option]:bg-card",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-[11px] font-medium uppercase tracking-[0.06em] text-faint", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Input, Select, Label };

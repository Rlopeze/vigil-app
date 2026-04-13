import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", id, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-brand-dark/60">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-brand-muted/50 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta/30 ${
          error ? "border-brand-terracotta" : "border-brand-dark/10"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-brand-terracotta">{error}</p>}
    </div>
  );
});

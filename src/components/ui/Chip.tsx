import { forwardRef } from "react";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active: boolean;
  size?: "sm" | "xs";
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ label, active, size = "sm", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          size === "xs" ? "text-xs" : "text-sm"
        } ${
          active
            ? "bg-primary text-bg"
            : "bg-border text-text hover:bg-surface-hover"
        } ${className ?? ""}`}
        {...props}
      >
        {label}
      </button>
    );
  },
);

Chip.displayName = "Chip";

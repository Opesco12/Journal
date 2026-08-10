import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, className, onCheckedChange, ...props }, ref) => (
    <button
      aria-checked={checked}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border border-input bg-white text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "border-primary bg-primary",
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
      ref={ref}
      role="checkbox"
      type="button"
      {...props}
    >
      {checked ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
    </button>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

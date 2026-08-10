import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type SpinnerProps = {
  className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => (
  <Loader2 aria-hidden="true" className={cn("h-4 w-4 animate-spin", className)} />
);

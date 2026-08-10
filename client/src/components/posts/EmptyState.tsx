import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type EmptyStateProps = {
  action?: string;
  href?: string;
  message: string;
  title: string;
};

export const EmptyState = ({ action, href, message, title }: EmptyStateProps) => (
  <div className="rounded-[24px] border border-dashed border-border bg-white p-10 text-center">
    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary-soft text-primary">
      <FileText className="h-6 w-6" aria-hidden="true" />
    </div>
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">{message}</p>
    {href && action ? (
      <Button asChild className="mt-6">
        <Link to={href}>{action}</Link>
      </Button>
    ) : null}
  </div>
);

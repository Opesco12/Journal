import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type AuthShellProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => (
  <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
    <section className="w-full max-w-[520px]">
      <Link className="mx-auto mb-8 flex w-fit items-center gap-3" to="/">
        <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary text-white shadow-[0_10px_26px_rgba(37,99,235,0.24)]">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-2xl font-bold tracking-tight text-foreground">Journal</span>
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-normal text-foreground">{title}</h1>
        <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
      </div>

      <Card className="rounded-[28px]">
        <CardContent className="p-6 sm:p-8">{children}</CardContent>
      </Card>
    </section>
  </main>
);

type AuthFieldProps = {
  error?: string;
  label: string;
  name: string;
  touched?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const AuthField = ({
  error,
  label,
  name,
  touched,
  ...props
}: AuthFieldProps) => {
  const hasError = Boolean(touched && error);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} invalid={hasError} {...props} />
      {hasError ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  );
};

export const AuthError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[16px] border border-destructive/20 bg-destructive-soft px-4 py-3 text-sm font-semibold text-destructive">
      {message}
    </div>
  );
};

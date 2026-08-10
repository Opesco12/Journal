import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import { Spinner } from "../components/common/Spinner";
import { Button } from "../components/ui/button";
import { login, type LoginInput } from "../lib/api";
import { AuthField, AuthShell } from "./authShared";

const loginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (values: LoginInput) => login(values),
    onSuccess: () => {
      navigate("/posts");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useFormik<LoginInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  return (
    <AuthShell
      title="Sign in to your account"
      subtitle={
        <>
          New here?{" "}
          <Link className="font-semibold text-primary" to="/signup">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3">
          <Button type="button" variant="outline" className="w-full">
            <span className="text-base font-bold text-primary">G</span>
            Continue with Google
          </Button>
          <Button type="button" variant="outline" className="w-full">
            <span className="text-sm font-bold text-foreground">GH</span>
            Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>Or continue with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-5" onSubmit={formik.handleSubmit}>
          <AuthField
            autoComplete="email"
            error={formik.errors.email}
            label="Email address"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="you@example.com"
            touched={formik.touched.email}
            type="email"
            value={formik.values.email}
          />
          <AuthField
            autoComplete="current-password"
            error={formik.errors.password}
            label="Password"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Enter your password"
            touched={formik.touched.password}
            type="password"
            value={formik.values.password}
          />

          <div className="flex justify-end">
            <a className="text-sm font-semibold text-primary" href="mailto:support@journal.dev">
              Forgot password?
            </a>
          </div>

          <Button className="w-full" disabled={mutation.isPending} size="lg" type="submit">
            {mutation.isPending ? <Spinner /> : null}
            Sign in
          </Button>
        </form>
      </div>
    </AuthShell>
  );
};

export default LoginPage;

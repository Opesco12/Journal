import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import { Spinner } from "../components/common/Spinner";
import { Button } from "../components/ui/button";
import { register, type RegisterInput } from "../lib/api";
import { AuthField, AuthShell } from "./authShared";

const signupSchema = Yup.object({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (values: RegisterInput) => register(values),
    onSuccess: () => {
      toast.success("Account created. You can sign in now.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useFormik<RegisterInput>({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    validationSchema: signupSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Already writing here?{" "}
          <Link className="font-semibold text-primary" to="/login">
            Sign in
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
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              autoComplete="given-name"
              error={formik.errors.firstname}
              label="First name"
              name="firstname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Ada"
              touched={formik.touched.firstname}
              value={formik.values.firstname}
            />
            <AuthField
              autoComplete="family-name"
              error={formik.errors.lastname}
              label="Last name"
              name="lastname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Lovelace"
              touched={formik.touched.lastname}
              value={formik.values.lastname}
            />
          </div>

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
            autoComplete="new-password"
            error={formik.errors.password}
            label="Password"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Create a password"
            touched={formik.touched.password}
            type="password"
            value={formik.values.password}
          />

          <Button className="w-full" disabled={mutation.isPending} size="lg" type="submit">
            {mutation.isPending ? <Spinner /> : null}
            Create account
          </Button>
        </form>
      </div>
    </AuthShell>
  );
};

export default SignupPage;

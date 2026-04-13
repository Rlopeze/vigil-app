import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "~/lib/auth";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Card } from "~/ui/card";

interface LoginForm {
  email: string;
  password: string;
}

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      await navigate({ to: "/dashboard" });
    } catch {
      setError("root", { message: "Invalid email or password" });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-brand-dark">Sign in</h2>

        {errors.root && (
          <p className="rounded-lg bg-brand-terracotta/10 px-3 py-2 text-sm text-brand-terracotta">
            {errors.root.message}
          </p>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email", { required: "Required" })}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          {...register("password", { required: "Required" })}
          error={errors.password?.message}
        />

        <Button type="submit" loading={isSubmitting}>
          Sign in
        </Button>

        <p className="text-center text-sm text-brand-muted">
          No account?{" "}
          <Link to="/signup" className="font-medium text-brand-terracotta hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </Card>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "~/lib/auth";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Card } from "~/ui/card";

interface SignupForm {
  name: string;
  orgName: string;
  email: string;
  password: string;
}

export const Route = createFileRoute("/_public/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup(data);
      await navigate({ to: "/dashboard" });
    } catch {
      setError("root", { message: "Could not create account" });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-brand-dark">Create account</h2>

        {errors.root && (
          <p className="rounded-lg bg-brand-terracotta/10 px-3 py-2 text-sm text-brand-terracotta">
            {errors.root.message}
          </p>
        )}

        <Input
          label="Your name"
          {...register("name", { required: "Required" })}
          error={errors.name?.message}
        />
        <Input
          label="Organization name"
          {...register("orgName", { required: "Required" })}
          error={errors.orgName?.message}
        />
        <Input
          label="Work email"
          type="email"
          autoComplete="email"
          {...register("email", { required: "Required" })}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 characters" } })}
          error={errors.password?.message}
        />

        <Button type="submit" loading={isSubmitting}>
          Create account
        </Button>

        <p className="text-center text-sm text-brand-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-terracotta hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}

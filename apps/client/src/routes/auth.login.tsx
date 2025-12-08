import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      redirect: z.string().url().optional(),
    }),
  ),
});

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <img
            src="/logo.png"
            alt="Kubeploy"
            className="aspect-square size-6"
          />
          Kubeploy
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}

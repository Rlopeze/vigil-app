import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-brand-cream">Vigil</h1>
          <p className="mt-1 text-sm text-brand-muted">Customer frustration detection</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

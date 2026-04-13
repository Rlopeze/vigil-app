import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "~/components/sidebar";
import { Header } from "~/components/header";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: () => {
    // Client-side auth guard. SSR-aware check can be added when backend
    // sets an httpOnly cookie alongside the JWT.
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("vigil_access_token");
      if (!token) {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-brand-cream">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api-client";
import { Card } from "~/ui/card";
import type { DashboardStats } from "~/types/api";

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.get("/dashboard/stats").then((r) => r.data),
  });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-brand-muted">Frustration signals across your product</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="text-xs uppercase tracking-wide text-brand-muted">Sessions (7d)</div>
          <div className="mt-2 font-display text-3xl font-bold">
            {isLoading ? "—" : data?.sessionCount ?? 0}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wide text-brand-muted">Signals (7d)</div>
          <div className="mt-2 font-display text-3xl font-bold">
            {isLoading ? "—" : data?.eventCount ?? 0}
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wide text-brand-muted">Top signal</div>
          <div className="mt-2 font-display text-3xl font-bold">
            {isLoading || !data?.byType.length
              ? "—"
              : [...data.byType].sort((a, b) => b.count - a.count)[0].type}
          </div>
        </Card>
      </div>
    </div>
  );
}

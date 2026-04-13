import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api-client";
import { Card } from "~/ui/card";
import { Badge } from "~/ui/badge";
import type { SessionSummary } from "~/types/session";

export const Route = createFileRoute("/_dashboard/sessions")({
  component: SessionsPage,
});

function SessionsPage() {
  const { data, isLoading } = useQuery<{ sessions: SessionSummary[] }>({
    queryKey: ["sessions"],
    queryFn: () => api.get("/sessions").then((r) => r.data),
  });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold">Sessions</h1>
      <p className="mt-1 text-sm text-brand-muted">Recent monitored sessions</p>

      <Card className="mt-6 p-0">
        {isLoading ? (
          <div className="p-6 text-sm text-brand-muted">Loading…</div>
        ) : !data?.sessions.length ? (
          <div className="p-6 text-sm text-brand-muted">No sessions yet</div>
        ) : (
          <ul className="divide-y divide-brand-dark/10">
            {data.sessions.map((s) => (
              <li key={s.id}>
                <Link
                  to="/sessions/$id"
                  params={{ id: s.id }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-brand-dark/5"
                >
                  <div>
                    <div className="font-medium text-brand-dark">{s.url ?? s.externalId}</div>
                    <div className="text-xs text-brand-muted">
                      {new Date(s.startedAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge tone="neutral">{s._count?.events ?? 0} signals</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

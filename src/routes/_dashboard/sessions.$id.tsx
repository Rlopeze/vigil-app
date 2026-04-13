import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api-client";
import { Card } from "~/ui/card";
import { Badge } from "~/ui/badge";
import type { SessionDetail } from "~/types/session";

export const Route = createFileRoute("/_dashboard/sessions/$id")({
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery<SessionDetail>({
    queryKey: ["sessions", id],
    queryFn: () => api.get(`/sessions/${id}`).then((r) => r.data),
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-bold">Session</h1>
      <p className="mt-1 font-mono text-xs text-brand-muted">{id}</p>

      {isLoading ? (
        <Card className="mt-6">Loading…</Card>
      ) : !data ? (
        <Card className="mt-6">Not found</Card>
      ) : (
        <>
          <Card className="mt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase text-brand-muted">URL</div>
                <div>{data.url ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-brand-muted">Started</div>
                <div>{new Date(data.startedAt).toLocaleString()}</div>
              </div>
            </div>
          </Card>

          <h2 className="mt-8 font-display text-lg font-semibold">Signals</h2>
          <Card className="mt-3 p-0">
            <ul className="divide-y divide-brand-dark/10">
              {data.events.map((e) => (
                <li key={e.id} className="flex items-start justify-between px-6 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone="terracotta">{e.type}</Badge>
                      <span className="text-sm font-medium text-brand-dark">{e.label}</span>
                    </div>
                    <div className="mt-1 text-xs text-brand-muted">{e.detail}</div>
                  </div>
                  <div className="text-xs text-brand-muted">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}

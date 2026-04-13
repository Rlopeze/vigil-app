import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api-client";
import { Card } from "~/ui/card";

interface OrgMe {
  id: string;
  name: string;
  slug: string;
  plan: string;
  apiKey: string;
}

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data } = useQuery<OrgMe>({
    queryKey: ["org", "me"],
    queryFn: () => api.get("/orgs/me").then((r) => r.data),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <Card className="mt-6">
        <h2 className="font-display text-lg font-semibold">Organization</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase text-brand-muted">Name</dt>
            <dd>{data?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-brand-muted">Plan</dt>
            <dd>{data?.plan ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-4">
        <h2 className="font-display text-lg font-semibold">API key</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Use this key in the <code>x-vigil-api-key</code> header when sending events from your SDK.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-brand-dark p-3 font-mono text-xs text-brand-cream">
          {data?.apiKey ?? "—"}
        </pre>
      </Card>
    </div>
  );
}

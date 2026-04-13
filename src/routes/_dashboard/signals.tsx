import { createFileRoute } from "@tanstack/react-router";
import { Card } from "~/ui/card";

export const Route = createFileRoute("/_dashboard/signals")({
  component: SignalsPage,
});

function SignalsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold">Signals</h1>
      <p className="mt-1 text-sm text-brand-muted">Live feed of detected frustration events</p>

      <Card className="mt-6">
        <p className="text-sm text-brand-muted">Signal feed coming soon.</p>
      </Card>
    </div>
  );
}

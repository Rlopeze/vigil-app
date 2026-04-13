export type SignalType =
  | "rage_click"
  | "dead_click"
  | "error_loop"
  | "thrashing"
  | "session_stall"
  | "abandonment";

export interface FrustrationEvent {
  id: string;
  sessionId: string;
  type: SignalType;
  label: string;
  detail: string;
  element: string;
  x: number;
  y: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SessionSummary {
  id: string;
  externalId: string;
  orgId: string;
  userAgent: string | null;
  url: string | null;
  startedAt: string;
  endedAt: string | null;
  _count?: { events: number };
}

export interface SessionDetail extends SessionSummary {
  events: FrustrationEvent[];
}

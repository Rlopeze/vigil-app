export type SignalType =
  | "rage_click"
  | "dead_click"
  | "error_loop"
  | "thrashing";

export type Signal = {
  id: string;
  projectId: string;
  sessionId: string;
  type: SignalType;
  label: string;
  detail: string;
  element: string;
  url: string;
  timestamp: number;
  x: number;
  y: number;
};

export type IngestPayload = {
  type: SignalType;
  label: string;
  detail: string;
  element: string;
  url: string;
  timestamp: number;
  x: number;
  y: number;
  sessionId: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: number;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt: number;
};

export type Session = {
  id: string;
  projectId: string;
  url: string;
  startedAt: number;
  lastSignalAt: number;
  signalCount: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  error: string;
};

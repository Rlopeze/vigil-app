const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function getToken(): string | null {
  return localStorage.getItem("vigil_token");
}

export function setToken(token: string) {
  localStorage.setItem("vigil_token", token);
}

export function clearToken() {
  localStorage.removeItem("vigil_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function signup(email: string, password: string, name: string) {
  return request<{ token: string; user: { id: string; email: string; name: string } }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; name: string } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return request<{ id: string; email: string; name: string }>("/api/auth/me");
}

export async function getProjects() {
  return request<Array<{ id: string; name: string; domain: string; apiKey: string; createdAt: number }>>("/api/projects");
}

export async function createProject(name: string, domain: string) {
  return request<{ id: string; name: string; domain: string; apiKey: string; createdAt: number }>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name, domain }),
  });
}

export async function getProjectSignals(projectId: string, limit = 100) {
  return request<Array<{
    id: string; type: string; label: string; detail: string;
    element: string; url: string; timestamp: number; sessionId: string;
  }>>(`/api/projects/${projectId}/signals?limit=${limit}`);
}

export async function getProjectSessions(projectId: string) {
  return request<Array<{
    id: string; url: string; startedAt: number; lastSignalAt: number; signalCount: number;
  }>>(`/api/projects/${projectId}/sessions`);
}

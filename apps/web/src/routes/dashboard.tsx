import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { isAuthenticated, getMe, getProjects, createProject, getProjectSignals, getProjectSessions, clearToken } from "../lib/api";

type Project = { id: string; name: string; domain: string; apiKey: string; createdAt: number };
type Signal = { id: string; type: string; label: string; detail: string; element: string; url: string; timestamp: number; sessionId: string };
type Session = { id: string; url: string; startedAt: number; lastSignalAt: number; signalCount: number };

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

// ── Snippet modal ──
function SnippetModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const snippet = `<script src="${API_BASE}/t/vigil.js" data-key="${project.apiKey}"><\/script>`;
  const [copied, setCopied] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1a1714", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "32px", maxWidth: 560, width: "100%" }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Install Vigil on your site</h3>
        <p style={{ fontSize: 13, color: "rgba(244,239,230,0.4)", marginBottom: 20, lineHeight: 1.6 }}>
          Add this snippet before the closing <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>&lt;/body&gt;</code> tag on <strong style={{ color: "#f4efe6" }}>{project.domain}</strong>
        </p>
        <div style={{ position: "relative" }}>
          <pre style={{
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
            padding: "16px 20px", fontSize: 12, color: "#4ecba5", fontFamily: "'SF Mono', 'Fira Code', monospace",
            overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all",
          }}>
            {snippet}
          </pre>
          <button
            onClick={() => { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{
              position: "absolute", top: 10, right: 10, padding: "6px 12px", background: copied ? "rgba(78,203,165,0.15)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${copied ? "rgba(78,203,165,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 6,
              color: copied ? "#4ecba5" : "rgba(244,239,230,0.5)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(212,97,62,0.06)", border: "1px solid rgba(212,97,62,0.15)", borderRadius: 8, fontSize: 12, color: "rgba(244,239,230,0.45)", lineHeight: 1.6 }}>
          <strong style={{ color: "#d4613e" }}>API Key:</strong> <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, color: "#f4efe6" }}>{project.apiKey}</code>
        </div>
        <button onClick={onClose} style={{ marginTop: 20, width: "100%", padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(244,239,230,0.5)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          Close
        </button>
      </div>
    </div>
  );
}

// ── Create project modal ──
function CreateProjectModal({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createProject(name, domain);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1a1714", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "32px", maxWidth: 440, width: "100%" }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Project</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {error && <div style={{ padding: "10px 14px", background: "rgba(224,90,58,0.1)", border: "1px solid rgba(224,90,58,0.2)", borderRadius: 8, fontSize: 13, color: "#e05a3a" }}>{error}</div>}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,239,230,0.4)", display: "block", marginBottom: 6 }}>Project name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="My SaaS App"
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, color: "#f4efe6", fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,239,230,0.4)", display: "block", marginBottom: 6 }}>Domain</label>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} required placeholder="app.example.com"
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, color: "#f4efe6", fontFamily: "inherit", outline: "none" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: "#d4613e", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? "Creating..." : "Create project"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ──
function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSnippet, setShowSnippet] = useState<Project | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [live, setLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return;
    }
    getMe().then(setUser).catch(() => { clearToken(); navigate({ to: "/login" }); });
  }, [navigate]);

  // Load projects
  const loadProjects = useCallback(async () => {
    try {
      const p = await getProjects();
      setProjects(p);
      if (!selectedProject && p.length > 0) setSelectedProject(p[0]);
    } catch {}
  }, [selectedProject]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  // Load signals for selected project
  const loadSignals = useCallback(async () => {
    if (!selectedProject) return;
    try {
      const [sigs, sess] = await Promise.all([
        getProjectSignals(selectedProject.id),
        getProjectSessions(selectedProject.id),
      ]);
      setSignals(sigs);
      setSessions(sess);
    } catch {}
  }, [selectedProject]);

  useEffect(() => {
    loadSignals();
    if (live) {
      intervalRef.current = setInterval(loadSignals, 2000);
    }
    return () => clearInterval(intervalRef.current);
  }, [live, loadSignals]);

  const typeColors: Record<string, string> = { rage_click: "#e05a3a", dead_click: "#d4613e", error_loop: "#d4a13e", thrashing: "#d4a13e" };
  const typeIcons: Record<string, string> = { rage_click: "!!", dead_click: "\u2715", error_loop: "\u21BA", thrashing: "\u2248" };

  const handleLogout = () => { clearToken(); navigate({ to: "/login" }); };

  if (!user) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0f0d0b; font-family: 'Inter', -apple-system, sans-serif; color: #f4efe6; -webkit-font-smoothing: antialiased; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes signal-in { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      {showSnippet && <SnippetModal project={showSnippet} onClose={() => setShowSnippet(null)} />}
      {showCreateProject && <CreateProjectModal onCreated={loadProjects} onClose={() => setShowCreateProject(false)} />}

      {/* Header */}
      <div style={{
        padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(26,23,20,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" stroke="#d4613e" strokeWidth="2" />
            <circle cx="16" cy="16" r="5" fill="#d4613e" />
            <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke="#d4613e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#f4efe6" }}>Vigil</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setLive(!live)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
            background: live ? "rgba(78,203,165,0.1)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${live ? "rgba(78,203,165,0.25)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 8, color: live ? "#4ecba5" : "rgba(244,239,230,0.4)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: live ? "#4ecba5" : "rgba(244,239,230,0.2)", animation: live ? "blink 2s ease-in-out infinite" : "none" }} />
            {live ? "Live" : "Paused"}
          </button>
          <span style={{ fontSize: 12, color: "rgba(244,239,230,0.3)" }}>{user.name}</span>
          <button onClick={handleLogout} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(244,239,230,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 49px)" }}>
        {/* Sidebar — Projects */}
        <div style={{ width: 260, minWidth: 260, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "16px 0", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,239,230,0.25)" }}>Projects</span>
            <button onClick={() => setShowCreateProject(true)} style={{
              padding: "4px 10px", background: "rgba(212,97,62,0.1)", border: "1px solid rgba(212,97,62,0.2)", borderRadius: 6,
              color: "#d4613e", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>+ New</button>
          </div>
          {projects.map((p) => (
            <button key={p.id} onClick={() => setSelectedProject(p)} style={{
              width: "100%", padding: "12px 16px", background: selectedProject?.id === p.id ? "rgba(212,97,62,0.08)" : "transparent",
              border: "none", borderLeft: selectedProject?.id === p.id ? "2px solid #d4613e" : "2px solid transparent",
              color: selectedProject?.id === p.id ? "#f4efe6" : "rgba(244,239,230,0.4)", fontSize: 13, textAlign: "left", cursor: "pointer", fontFamily: "inherit",
            }}>
              <div style={{ fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "rgba(244,239,230,0.2)", marginTop: 2 }}>{p.domain}</div>
            </button>
          ))}
          {projects.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: "rgba(244,239,230,0.15)" }}>
              No projects yet. Create one to get started.
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto" }}>
          {!selectedProject ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(244,239,230,0.2)" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>&#128065;</div>
              <p style={{ fontSize: 16, marginBottom: 8 }}>Welcome to Vigil</p>
              <p style={{ fontSize: 13, color: "rgba(244,239,230,0.12)" }}>Create a project to start monitoring your users.</p>
            </div>
          ) : (
            <>
              {/* Project header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{selectedProject.name}</h1>
                  <p style={{ fontSize: 13, color: "rgba(244,239,230,0.3)", marginTop: 4 }}>{selectedProject.domain}</p>
                </div>
                <button onClick={() => setShowSnippet(selectedProject)} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgba(212,97,62,0.1)",
                  border: "1px solid rgba(212,97,62,0.25)", borderRadius: 8, color: "#d4613e", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                  &lt;/&gt; Get Snippet
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
                {[
                  { label: "Total Signals", value: signals.length, color: "#f4efe6" },
                  { label: "Rage Clicks", value: signals.filter(s => s.type === "rage_click").length, color: "#e05a3a" },
                  { label: "Dead Clicks", value: signals.filter(s => s.type === "dead_click").length, color: "#d4613e" },
                  { label: "Error Loops", value: signals.filter(s => s.type === "error_loop").length, color: "#d4a13e" },
                  { label: "Sessions", value: sessions.length, color: "#4ecba5" },
                ].map((stat) => (
                  <div key={stat.label} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "rgba(244,239,230,0.3)", marginBottom: 6, fontWeight: 500 }}>{stat.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Signal feed */}
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,239,230,0.25)", marginBottom: 14 }}>
                Signal Feed
              </div>
              {signals.length === 0 ? (
                <div style={{ padding: "50px 20px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 12, color: "rgba(244,239,230,0.15)" }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>&#128065;</div>
                  <p style={{ fontSize: 14 }}>No signals yet</p>
                  <p style={{ fontSize: 12, color: "rgba(244,239,230,0.1)", marginTop: 6 }}>Install the snippet on your site and signals will appear here in real time.</p>
                  <button onClick={() => setShowSnippet(selectedProject)} style={{
                    marginTop: 16, padding: "10px 20px", background: "rgba(212,97,62,0.1)", border: "1px solid rgba(212,97,62,0.2)",
                    borderRadius: 8, color: "#d4613e", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Get Snippet
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {signals.map((sig) => (
                    <div key={sig.id} style={{
                      padding: "12px 18px", display: "flex", gap: 14, alignItems: "flex-start",
                      background: "rgba(255,255,255,0.02)", borderRadius: 8, animation: "signal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}>
                      <div style={{
                        width: 30, height: 30, minWidth: 30, borderRadius: 8,
                        background: `${typeColors[sig.type] || "#888"}15`, color: typeColors[sig.type] || "#888",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, marginTop: 2,
                      }}>
                        {typeIcons[sig.type] || "?"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: typeColors[sig.type] || "#888" }}>{sig.label}</span>
                          <span style={{ fontSize: 10, padding: "2px 8px", background: `${typeColors[sig.type] || "#888"}15`, color: typeColors[sig.type] || "#888", borderRadius: 100, fontWeight: 500 }}>
                            {sig.type.replace("_", " ")}
                          </span>
                          <span style={{ fontSize: 10, color: "rgba(244,239,230,0.15)", fontFamily: "monospace" }}>{sig.sessionId.slice(0, 16)}</span>
                          <span style={{ fontSize: 11, color: "rgba(244,239,230,0.2)", marginLeft: "auto" }}>
                            {new Date(sig.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(244,239,230,0.4)", lineHeight: 1.5, margin: 0 }}>{sig.detail}</p>
                        {sig.url && <span style={{ fontSize: 11, color: "rgba(244,239,230,0.12)", marginTop: 2, display: "inline-block" }}>{sig.url}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

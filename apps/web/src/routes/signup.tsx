import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signup, setToken } from "../lib/api";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signup(email, password, name);
      setToken(res.token);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0f0d0b; font-family: 'Inter', -apple-system, sans-serif; color: #f4efe6; -webkit-font-smoothing: antialiased; }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 400, padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="8" stroke="#d4613e" strokeWidth="2" />
                <circle cx="16" cy="16" r="5" fill="#d4613e" />
                <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke="#d4613e" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#f4efe6" }}>Vigil</span>
            </div>
            <p style={{ color: "rgba(244,239,230,0.35)", fontSize: 14, marginTop: 12 }}>Create your Vigil account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(224,90,58,0.1)", border: "1px solid rgba(224,90,58,0.2)", borderRadius: 8, fontSize: 13, color: "#e05a3a" }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,239,230,0.4)", display: "block", marginBottom: 6 }}>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, color: "#f4efe6", fontFamily: "inherit", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,239,230,0.4)", display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com"
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, color: "#f4efe6", fontFamily: "inherit", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,239,230,0.4)", display: "block", marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters"
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, color: "#f4efe6", fontFamily: "inherit", outline: "none" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", background: "#d4613e", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1, marginTop: 8 }}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(244,239,230,0.3)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#d4613e", textDecoration: "none", fontWeight: 500 }}>Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}

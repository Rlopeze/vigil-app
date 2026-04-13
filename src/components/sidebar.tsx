import { Link } from "@tanstack/react-router";

const navItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/sessions", label: "Sessions" },
  { to: "/signals", label: "Signals" },
  { to: "/settings", label: "Settings" },
] as const;

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-brand-dark/10 bg-brand-cream">
      <div className="px-6 py-5">
        <div className="font-display text-lg font-bold text-brand-dark">Vigil</div>
        <div className="text-xs text-brand-muted">Dashboard</div>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-md px-3 py-2 text-sm text-brand-dark/70 hover:bg-brand-dark/5 hover:text-brand-dark"
            activeProps={{ className: "bg-brand-dark/5 text-brand-dark font-medium" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

import { useAuth } from "~/lib/auth";
import { Button } from "~/ui/button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-brand-dark/10 bg-white px-6">
      <div className="text-sm text-brand-muted">
        {user ? `${user.orgName}` : ""}
      </div>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm text-brand-dark/70">{user.email}</span>}
        <Button variant="ghost" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}

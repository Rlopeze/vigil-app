import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken } from "./api-client";
import { AuthResponseSchema, type User } from "~/types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    name: string;
    orgName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate user from stored token on mount
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get("/orgs/me")
      .then((res) => {
        // We only have org here; backend could be extended with /auth/me.
        // For now leave user null; guarded routes will re-fetch on login.
        void res;
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const parsed = AuthResponseSchema.parse(data);
    setToken(parsed.token);
    setUser(parsed.user);
  }, []);

  const signup = useCallback(
    async (payload: { email: string; password: string; name: string; orgName: string }) => {
      const { data } = await api.post("/auth/signup", payload);
      const parsed = AuthResponseSchema.parse(data);
      setToken(parsed.token);
      setUser(parsed.user);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

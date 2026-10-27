import { createContext, useContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
export interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<string | null>;
  logout: () => void;
}

export const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

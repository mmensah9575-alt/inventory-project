import { useState } from "react";
import type { ReactNode } from "react";
import { Ctx } from "./authContext";
import type { AuthUser } from "./authContext";
import { getAll, save } from "./db";
import { hash } from "./hash";
import type { User } from "./types";

const KEY = "ims.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem(KEY);
      const u = s ? JSON.parse(s) : null;
      return u && typeof u.id === "string" ? (u as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const start = (u: User) => {
    const a = { id: u.id, name: u.name, email: u.email };
    setUser(a);
    localStorage.setItem(KEY, JSON.stringify(a));
  };

  const register = async (name: string, rawEmail: string, password: string) => {
    const users = await getAll<User>("users");
    const email = rawEmail.trim();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      return "An account with this email already exists";
    const u: User = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: await hash(email, password),
      role: users.length === 0 ? "admin" : "staff",
    };
    await save("users", u);
    start(u);
    return null;
  };

  const login = async (rawEmail: string, password: string) => {
    const email= rawEmail.trim()
    const users = await getAll<User>("users");
    const h = await hash(email, password);
    const u = users.find(
      (x) =>
        x.email.toLowerCase() === email.toLowerCase() && x.passwordHash === h,
    );
    if (!u) return "Incorrect email or password";
    start(u);
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  return (
    <Ctx.Provider value={{ user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

interface AuthContextType {
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_email");
    if (stored) setUserEmail(stored);
  }, []);

  const login = async (email: string, password: string) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const { data } = await api.post("/auth/token", form);
    const { access_token } = data as { access_token: string };
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user_email", email);
    setUserEmail(email);
  };

  const signup = async (name: string, email: string, password: string) => {
    await api.post("/auth/signup", { name, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ userEmail, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
